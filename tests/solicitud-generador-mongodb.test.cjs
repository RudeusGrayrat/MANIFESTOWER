// Integración con MongoDB local aislado: no lee la configuración ni los datos de producción.
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
const net = require("node:net");
const { spawn } = require("node:child_process");
const backend = path.resolve(__dirname, "../../GESTOWER_backend");
const load = (name) => require(path.join(backend, name));
const mongoose = load("node_modules/mongoose");
const bcrypt = load("node_modules/bcrypt");
mongoose.set("autoCreate", false);
mongoose.set("autoIndex", false);
const Solicitud = load("src/models/ManifesTower/SolicitudGenerador");
const Usuario = load("src/models/ManifesTower/UserExternal");
const Generador = load("src/models/AllModulos/Certificacion/Generadores");
const Transportista = load("src/models/AllModulos/Certificacion/Transportistas");
const Vinculacion = load("src/models/ManifesTower/Vinculacion");
const Ubigeo = load("src/models/AllModulos/Certificacion/Ubigeo");
const Notificacion = load("src/controllers/Herramientas/Notification/CreateNotification");
const controller = load("src/controllers/AllModulos/Certificaciones/ManifesTower/solicitudGenerador");
const mongod = process.env.TEST_MONGOD || "C:\\Program Files\\MongoDB\\Server\\8.2\\bin\\mongod.exe";
const firma = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLkNwAAAABJRU5ErkJggg==";
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const respuesta = () => ({ statusCode: 200, status(n) { this.statusCode = n; return this; }, json(body) { this.body = body; return this; }, set() { return this; } });
const portLibre = () => new Promise((resolve, reject) => { const server = net.createServer(); server.once("error", reject); server.listen(0, "127.0.0.1", () => { const port = server.address().port; server.close(() => resolve(port)); }); });

test("recorrido y transacción con MongoDB aislado", { timeout: 90000 }, async (t) => {
    assert.ok(fs.existsSync(mongod), "Configura TEST_MONGOD con la ruta de mongod para ejecutar esta prueba");
    const temp = fs.realpathSync(os.tmpdir());
    const dir = fs.mkdtempSync(path.join(temp, "manifestower-mongodb-test-"));
    const port = await portLibre();
    const child = spawn(mongod, ["--bind_ip", "127.0.0.1", "--port", String(port), "--dbpath", dir, "--replSet", "manifestower_test", "--quiet"], { windowsHide: true, stdio: "ignore" });
    let childError; child.once("error", (error) => { childError = error; });
    t.after(async () => {
        await mongoose.disconnect();
        if (child.exitCode === null && child.signalCode === null) {
            child.kill();
            await Promise.race([new Promise((resolve) => child.once("exit", resolve)), pause(5000)]);
        }
        // El único directorio borrado es el temporal generado para esta prueba.
        const target = path.resolve(dir);
        if ((child.exitCode !== null || child.signalCode !== null) && path.dirname(target) === temp && path.basename(target).startsWith("manifestower-mongodb-test-")) fs.rmSync(target, { recursive: true, force: true });
    });
    const uri = `mongodb://127.0.0.1:${port}/manifestower_test?directConnection=true`;
    let connected = false;
    for (let i = 0; i < 60 && !connected; i++) {
        if (childError || child.exitCode !== null) throw childError || new Error(`mongod terminó con código ${child.exitCode}`);
        try { await mongoose.connect(uri, { serverSelectionTimeoutMS: 500 }); connected = true; }
        catch (_) { await pause(250); }
    }
    assert.ok(connected, "No arrancó MongoDB aislado");
    await mongoose.connection.db.admin().command({ replSetInitiate: { _id: "manifestower_test", members: [{ _id: 0, host: `127.0.0.1:${port}` }] } });
    let primary = false;
    for (let i = 0; i < 60 && !primary; i++) { try { primary = !!(await mongoose.connection.db.admin().command({ hello: 1 })).isWritablePrimary; } catch (_) {} if (!primary) await pause(250); }
    assert.ok(primary, "La réplica aislada no eligió un nodo primario");
    const models = [Solicitud, Generador, Usuario, Transportista, Ubigeo, Vinculacion];
    await Promise.all(models.map((model) => model.createCollection()));
    await Promise.all(models.map((model) => model.createIndexes()));
    t.mock.method(Notificacion, "send", async () => {});

    const ubigeo = await Ubigeo.create({ codigo: "000001", departamento: "Prueba", provincia: "Prueba", distrito: "Prueba" });
    const transportista = await Transportista.create({ razonSocial: "Transporte de prueba", ruc: "20000000001", registroEors: "TEST", direccion: "Prueba", ubigeoId: ubigeo._id, correoElectronico: "prueba@example.test", telefono: "123" });
    const transportistaUser = new mongoose.Types.ObjectId();
    const employeeId = new mongoose.Types.ObjectId();
    const req = (body = {}, extra = {}) => ({ body, usuarioTransportista: { _id: transportistaUser, transportistaId: transportista._id }, app: { get: () => ({}) }, user: { _id: employeeId }, ...extra });
    const created = respuesta();
    await controller.crear(req({ ruc: "20000000002", razonSocial: "Generador de prueba", correoElectronico: "generador@example.test", telefono: "123" }), created);
    assert.equal(created.statusCode, 201);
    const password = "contraseña de prueba segura";
    const body = { token: created.body.token, correoElectronico: "generador@example.test", telefono: "123", representanteLegal: "Representante", dniRepresentante: "12345678", password, aceptaVinculacion: true, responsable: { nombreResponsable: "Responsable", dniResponsable: "12345678", cargoResponsable: "Técnico", firmaResponsable: firma }, planta: { denominacion: "Planta", tipoPlanta: "PRINCIPAL", direccion: "Dirección", actividadEconomica: "Servicio", ubigeoId: String(ubigeo._id) } };
    const done = respuesta(); await controller.completar(req(body), done); assert.equal(done.statusCode, 200, JSON.stringify(done.body));
    const record = await Solicitud.findOne({ ruc: "20000000002" });
    assert.equal(record.estado, "PENDIENTE_VERIFICACION");
    assert.equal(await Generador.countDocuments({ ruc: record.ruc }), 0);
    const invalid = respuesta(); await controller.recuperarCodigo(req({ ruc: record.ruc, password: "contraseña equivocada" }), invalid); assert.equal(invalid.statusCode, 401);
    const recovery = respuesta(); await controller.recuperarCodigo(req({ ruc: record.ruc, password }), recovery); assert.equal(recovery.statusCode, 200, JSON.stringify(recovery.body));
    assert.notEqual(recovery.body.codigoVerificacion, done.body.codigoVerificacion);
    const approval = (code) => req({ verificacionConfirmada: true, detalleVerificacion: "Identidad comprobada por canal independiente", codigoVerificacion: code }, { params: { id: record._id } });
    const old = respuesta(); await controller.aprobar(approval(done.body.codigoVerificacion), old); assert.equal(old.statusCode, 400);
    const approved = respuesta(); await controller.aprobar(approval(recovery.body.codigoVerificacion), approved); assert.equal(approved.statusCode, 200, JSON.stringify(approved.body));
    const final = await Solicitud.findById(record._id).select("+passwordHash +codigoVerificacionHash +datosCompletados");
    assert.equal(final.estado, "APROBADA"); assert.equal(final.passwordHash, undefined); assert.equal(final.codigoVerificacionHash, undefined); assert.equal(final.recuperacionesCodigo, 1);
    const generator = await Generador.findOne({ ruc: record.ruc });
    assert.ok(generator); assert.equal(generator.responsablesTecnicos[0].firmaResponsable, firma);
    assert.equal((await Usuario.findOne({ ruc: record.ruc })).estado, "ACTIVO");
    const link = await Vinculacion.findOne({ generadorId: generator._id }); assert.equal(link.status, "ACEPTADA"); assert.equal(link.tienePermisoLlenado, false);
    assert.equal((await Transportista.findById(transportista._id)).generadores.length, 1);
    const repeat = respuesta(); await controller.aprobar(approval(recovery.body.codigoVerificacion), repeat); assert.equal(repeat.statusCode, 409);
    const after = respuesta(); await controller.recuperarCodigo(req({ ruc: record.ruc, password }), after); assert.equal(after.statusCode, 401);

    // Limitar intentos por solicitud y comprobar que una transacción fallida no deja cuentas parciales.
    const crypto = require("node:crypto");
    const code2 = "0123456789ABCDEF";
    const broken = await Solicitud.create({ ruc: "20000000003", razonSocial: "Generador de prueba 2", correoElectronico: "otro@example.test", telefono: "123", transportistaId: new mongoose.Types.ObjectId(), creadoPor: transportistaUser, estado: "PENDIENTE_VERIFICACION", passwordHash: await bcrypt.hash(password, 12), codigoVerificacionHash: crypto.createHash("sha256").update(code2).digest("hex"), datosCompletados: { representanteLegal: body.representanteLegal, dniRepresentante: body.dniRepresentante, responsablesTecnicos: [body.responsable], plantas: [body.planta], aceptoVinculacion: true, fechaAceptacion: new Date() } });
    for (let i = 0; i < 5; i++) { const denied = respuesta(); await controller.recuperarCodigo(req({ ruc: broken.ruc, password: "incorrecta" }), denied); assert.equal(denied.statusCode, 401); }
    const locked = respuesta(); await controller.recuperarCodigo(req({ ruc: broken.ruc, password }), locked); assert.equal(locked.statusCode, 401);
    const rollback = respuesta(); await controller.aprobar(req({ verificacionConfirmada: true, detalleVerificacion: "Prueba", codigoVerificacion: code2 }, { params: { id: broken._id } }), rollback);
    assert.equal(rollback.statusCode, 409, JSON.stringify(rollback.body));
    assert.equal(await Generador.countDocuments({ ruc: broken.ruc }), 0);
    assert.equal(await Usuario.countDocuments({ ruc: broken.ruc }), 0);
    assert.equal((await Solicitud.findById(broken._id)).estado, "PENDIENTE_VERIFICACION");
});
