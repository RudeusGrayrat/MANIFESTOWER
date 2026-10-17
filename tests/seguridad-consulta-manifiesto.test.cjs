const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const Manifiesto = require(path.resolve(__dirname, "../../GESTOWER_backend/src/models/AllModulos/Certificacion/Manifiestos"));
const acceso = require(path.resolve(__dirname, "../../GESTOWER_backend/src/controllers/AllModulos/Certificaciones/ManifesTower/accesoConsultaManifiesto"));
const response = () => ({ statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });
test("lectura usa usuario de sesión y permiso interno VER", async () => {
    const req = { externalUser: { _id: "real" }, externalRole: "GENERADOR", query: { usuario: "falso", rolActivo: "TRANSPORTISTA" } }; acceso.filtrar(req, response(), () => {});
    assert.equal(req.query.usuario, "real"); assert.equal(req.query.rolActivo, "GENERADOR");
    const forbidden = response(); acceso.permiso({ user: { _id: "id", state: "ACTIVO", modules: [] } }, forbidden, () => assert.fail()); assert.equal(forbidden.statusCode, 403);
    let allowed = false; acceso.permiso({ user: { _id: "id", state: "ACTIVO", modules: [{ submodule: { name: "MANIFIESTOS", permissions: ["VER"] } }] } }, response(), () => { allowed = true; }); assert.equal(allowed, true);
});
test("descarga solo para participantes y generador no ve borradores", async (t) => {
    let doc = { generadorId: "gen1", transportistaId: "trans1", estado: "BORRADOR" };
    t.mock.method(Manifiesto, "findById", () => ({ select() { return this; }, lean: async () => doc }));
    const req = { params: { id: "doc" }, externalRole: "GENERADOR", externalUser: { generadorId: "gen1" } };
    const draft = response(); await acceso.documento(req, draft, () => assert.fail()); assert.equal(draft.statusCode, 403);
    doc.estado = "ENVIADO"; let allowed = false; await acceso.documento(req, response(), () => { allowed = true; }); assert.equal(allowed, true);
    req.externalUser.generadorId = "otra"; const other = response(); await acceso.documento(req, other, () => assert.fail()); assert.equal(other.statusCode, 403);
});
