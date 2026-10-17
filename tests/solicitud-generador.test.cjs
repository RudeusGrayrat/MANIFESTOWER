const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const crypto = require("node:crypto");
const backend = path.resolve(__dirname, "../../GESTOWER_backend");
const load = (value) => require(path.join(backend, value));
const mongoose = load("node_modules/mongoose");
const jwt = load("node_modules/jsonwebtoken");
const Solicitud = load("src/models/ManifesTower/SolicitudGenerador");
const Usuario = load("src/models/ManifesTower/UserExternal");
const Generador = load("src/models/AllModulos/Certificacion/Generadores");
const Transportista = load("src/models/AllModulos/Certificacion/Transportistas");
const Vinculacion = load("src/models/ManifesTower/Vinculacion");
const Ubigeo = load("src/models/AllModulos/Certificacion/Ubigeo");
const Notificacion = load("src/controllers/Herramientas/Notification/CreateNotification");
const controller = load("src/controllers/AllModulos/Certificaciones/ManifesTower/solicitudGenerador");
const loginExternal = load("src/controllers/AllModulos/Certificaciones/ManifesTower/loginExternal");
const firma = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLkNwAAAABJRU5ErkJggg==";
const id = "0123456789abcdef01234567";
const transportistaId = "1123456789abcdef01234567";
const respuesta = () => ({ statusCode: 200, status(n) { this.statusCode = n; return this; }, json(body) { this.body = body; return this; }, set() { return this; } });
const request = (body = {}) => ({ body, params: { id }, usuarioTransportista: { _id: id, transportistaId }, app: { get: () => ({}) } });

test("la propuesta usa un token aleatorio, almacena solo su hash y notifica a generadores", async (t) => {
    t.mock.method(Generador, "exists", async () => false);
    t.mock.method(Usuario, "exists", async () => false);
    let guardada;
    t.mock.method(Solicitud, "create", async (data) => { guardada = { ...data, _id: id }; return guardada; });
    let notificacion;
    t.mock.method(Notificacion, "send", async (_io, data) => { notificacion = data; });
    const res = respuesta();
    await controller.crear(request({ ruc: "20123456789", razonSocial: "Ejemplo", correoElectronico: "a@empresa.pe", telefono: "123" }), res);
    assert.equal(res.statusCode, 201);
    assert.match(res.body.token, /^[A-Za-z0-9_-]{43}$/);
    assert.notEqual(guardada.invitacionHash, res.body.token);
    assert.equal(guardada.transportistaId, transportistaId);
    assert.equal(notificacion.scope.submoduleName, "GENERADORES");
    const invalid = respuesta();
    await controller.crear(request({ ruc: "201234567890", razonSocial: "Ejemplo", correoElectronico: "a@empresa.pe", telefono: "123" }), invalid);
    assert.equal(invalid.statusCode, 400);
});

test("la invitación exige aceptación y firma, consume el token y no activa la cuenta", async (t) => {
    const token = "A".repeat(43);
    const provisional = { _id: id, transportistaId: { _id: transportistaId, razonSocial: "Transporte" } };
    t.mock.method(Solicitud, "findOne", () => ({ populate: async () => provisional }));
    t.mock.method(Ubigeo, "exists", async () => true);
    let update;
    t.mock.method(Solicitud, "findOneAndUpdate", async (query, changes) => { update = { query, changes }; return { ...provisional, creadoPor: id, razonSocial: "Ejemplo", ruc: "20123456789" }; });
    t.mock.method(Notificacion, "send", async () => {});
    const body = { token, correoElectronico: "a@empresa.pe", telefono: "123", representanteLegal: "Representante", dniRepresentante: "12345678", password: "contraseña segura 123", aceptaVinculacion: true,
        responsable: { nombreResponsable: "Responsable", dniResponsable: "12345678", cargoResponsable: "Técnico", firmaResponsable: firma },
        planta: { denominacion: "Planta", tipoPlanta: "PRINCIPAL", direccion: "Dirección", actividadEconomica: "Servicio", ubigeoId: id } };
    const negada = respuesta(); await controller.completar(request({ ...body, aceptaVinculacion: false }), negada); assert.equal(negada.statusCode, 400);
    const res = respuesta(); await controller.completar(request(body), res);
    assert.equal(res.statusCode, 200);
    assert.equal(update.query.estado, "PENDIENTE_DATOS");
    assert.equal(update.changes.$set.estado, "PENDIENTE_VERIFICACION");
    assert.equal(update.changes.$set.datosCompletados.aceptoVinculacion, true);
    assert.ok(update.changes.$unset.invitacionHash);
    assert.notEqual(update.changes.$set.passwordHash, body.password);
    assert.match(res.body.codigoVerificacion, /^[A-F0-9]{16}$/);
    assert.notEqual(update.changes.$set.codigoVerificacionHash, res.body.codigoVerificacion);
});

test("las operaciones del transportista verifican el token y la cuenta", async (t) => {
    const previous = process.env.JWT_SECRET; process.env.JWT_SECRET = "secreto-de-prueba-no-productivo";
    t.after(() => { if (previous === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = previous; });
    t.mock.method(Usuario, "findById", async () => ({ _id: id, estado: "ACTIVO", roles: ["TRANSPORTISTA"], transportistaId }));
    const token = jwt.sign({ _id: id, role: "EXTERNAL", activeRole: "TRANSPORTISTA" }, process.env.JWT_SECRET);
    let next = false;
    await controller.autenticarTransportista({ headers: { authorization: `Bearer ${token}` } }, respuesta(), () => { next = true; });
    assert.equal(next, true);
    const res = respuesta(); await controller.autenticarTransportista({ headers: { authorization: "Bearer falso" } }, res, () => assert.fail());
    assert.equal(res.statusCode, 401);
});

test("aprobar requiere el permiso específico y una verificación independiente", async () => {
    let called = false;
    controller.permisoGeneradores("APROBAR")({ user: { _id: id, modules: [{ submodule: { name: "GENERADORES", permissions: ["VER"] } }] } }, respuesta(), () => { called = true; });
    assert.equal(called, false);
    const res = respuesta(); await controller.aprobar({ body: { verificacionConfirmada: true, detalleVerificacion: "" } }, res);
    assert.equal(res.statusCode, 400);
});

test("la activación transaccional crea la cuenta y el vínculo sin permiso automático", async (t) => {
    const codigo = "0123456789ABCDEF";
    const solicitud = { _id: id, estado: "PENDIENTE_VERIFICACION", ruc: "20123456789", razonSocial: "Empresa", correoElectronico: "a@empresa.pe", telefono: "123", transportistaId, passwordHash: "hash", codigoVerificacionHash: crypto.createHash("sha256").update(codigo).digest("hex"), datosCompletados: { aceptoVinculacion: true, fechaAceptacion: new Date(), representanteLegal: "Representante", dniRepresentante: "1", responsablesTecnicos: [], plantas: [] }, save: async () => {} };
    const session = { withTransaction: async (fn) => fn(), endSession: async () => {} };
    t.mock.method(mongoose, "startSession", async () => session);
    t.mock.method(Solicitud, "findOne", () => ({ select() { return this; }, session: async () => solicitud }));
    t.mock.method(Generador, "exists", () => ({ session: async () => false }));
    t.mock.method(Usuario, "exists", () => ({ session: async () => false }));
    t.mock.method(Generador, "create", async () => [{ _id: id }]);
    t.mock.method(Usuario, "create", async () => [{ _id: id }]);
    let vinculo;
    t.mock.method(Vinculacion, "create", async (docs) => { vinculo = docs[0]; });
    t.mock.method(Transportista, "updateOne", async () => ({ matchedCount: 1 }));
    t.mock.method(Usuario, "find", () => ({ select() { return this; }, lean: async () => [] }));
    t.mock.method(Notificacion, "send", async () => {});
    const rechazado = respuesta();
    await controller.aprobar({ body: { verificacionConfirmada: true, detalleVerificacion: "Contacto contrastado por Tower", codigoVerificacion: "FFFFFFFFFFFFFFFF" }, params: { id }, user: { _id: id }, app: { get: () => ({}) } }, rechazado);
    assert.equal(rechazado.statusCode, 400);
    assert.equal(solicitud.estado, "PENDIENTE_VERIFICACION");
    const res = respuesta();
    await controller.aprobar({ body: { verificacionConfirmada: true, detalleVerificacion: "Contacto contrastado por Tower", codigoVerificacion: codigo }, params: { id }, user: { _id: id }, app: { get: () => ({}) } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(vinculo.status, "ACEPTADA");
    assert.equal(vinculo.tienePermisoLlenado, false);
    assert.equal(solicitud.estado, "APROBADA");
    assert.equal(solicitud.passwordHash, undefined);
    assert.equal(solicitud.codigoVerificacionHash, undefined);
    assert.equal(solicitud.consentimientoVinculacion.version, "v1-vinculacion-sin-firma-automatica");
});

test("la renovación está limitada al transportista dueño y reemplaza el token", async (t) => {
    let filtro, cambios;
    t.mock.method(Solicitud, "findOneAndUpdate", async (query, update) => { filtro = query; cambios = update; return { invitacionExpira: new Date() }; });
    const res = respuesta(); await controller.renovar(request(), res);
    assert.equal(res.statusCode, 200);
    assert.equal(filtro.transportistaId, transportistaId);
    assert.equal(filtro.estado, "PENDIENTE_DATOS");
    assert.notEqual(cambios.$set.invitacionHash, res.body.token);
});

test("una cuenta externa inactiva no puede iniciar sesión", async (t) => {
    t.mock.method(Usuario, "findOne", async () => ({ estado: "INACTIVO" }));
    const res = respuesta();
    await loginExternal({ body: { typeUser: "GENERADOR", ruc: "20123456789", password: "contraseña" } }, res);
    assert.equal(res.statusCode, 403);
});
