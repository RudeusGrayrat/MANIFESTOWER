const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const backend = path.resolve(__dirname, "../../GESTOWER_backend");
const Manifiesto = require(path.join(backend, "src/models/AllModulos/Certificacion/Manifiestos"));
const Vinculacion = require(path.join(backend, "src/models/ManifesTower/Vinculacion"));
const acceso = require(path.join(backend, "src/controllers/AllModulos/Certificaciones/ManifesTower/accesoEscrituraManifiesto"));
const response = () => ({ statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });
test("el permiso separa empleados y transportistas", () => {
    const r = response(); acceso.permiso("APROBAR", false)({ externalUser: {}, externalRole: "TRANSPORTISTA" }, r, () => assert.fail()); assert.equal(r.statusCode, 403);
    const noPermission = response(); acceso.permiso("APROBAR", false)({ user: { _id: "id", state: "ACTIVO", modules: [] } }, noPermission, () => assert.fail()); assert.equal(noPermission.statusCode, 403);
    let allowed = false; acceso.permiso("APROBAR", false)({ user: { _id: "id", state: "ACTIVO", modules: [{ submodule: { name: "MANIFIESTOS", permissions: ["APROBAR"] } }] } }, response(), () => { allowed = true; }); assert.equal(allowed, true);
});
test("crear y editar exigen transportista propio y vínculo activo", async (t) => {
    let linked = true; let query;
    t.mock.method(Vinculacion, "exists", async (q) => { query = q; return linked; });
    t.mock.method(Manifiesto, "findById", () => ({ select() { return this; }, lean: async () => ({ generadorId: "g1", transportistaId: "t1" }) }));
    const req = { externalUser: { transportistaId: "t1" }, externalRole: "TRANSPORTISTA", params: { manifiestoId: "m" }, body: { transportistaId: "t1", generadorId: "g1" } };
    let ok = false; await acceso.crear(req, response(), () => { ok = true; }); assert.equal(ok, true); assert.equal(query.fechaDesvinculacion, null);
    req.body.transportistaId = "otro"; const denied = response(); await acceso.crear(req, denied, () => assert.fail()); assert.equal(denied.statusCode, 403);
    const deniedEdit = response(); await acceso.editar(req, deniedEdit, () => assert.fail()); assert.equal(deniedEdit.statusCode, 403);
    req.body.transportistaId = "t1"; linked = false; const unlinked = response(); await acceso.editar(req, unlinked, () => assert.fail()); assert.equal(unlinked.statusCode, 403);
});
