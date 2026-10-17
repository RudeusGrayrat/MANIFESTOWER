const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const Manifiesto = require(path.resolve(__dirname, "../../GESTOWER_backend/src/models/AllModulos/Certificacion/Manifiestos"));
const acceso = require(path.resolve(__dirname, "../../GESTOWER_backend/src/controllers/AllModulos/Certificaciones/ManifesTower/autorizarAccionManifiesto"));
const response = () => ({ statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });
test("solo el propietario con el rol correcto puede operar; el actor se toma de la sesión", async (t) => {
    let doc = { generadorId: "gen1", transportistaId: "trans1" };
    t.mock.method(Manifiesto, "findById", () => ({ select() { return this; }, lean: async () => doc }));
    const req = { params: { id: "doc" }, externalRole: "GENERADOR", externalUser: { _id: "usuario-real", generadorId: "gen1" }, query: { usuarioId: "otro" }, body: { usuarioId: "otro" } };
    let next = false; await acceso("GENERADOR")(req, response(), () => { next = true; });
    assert.equal(next, true); assert.equal(req.query.usuarioId, "usuario-real"); assert.equal(req.body.usuarioId, "usuario-real"); assert.equal(req.user._id, "usuario-real");
    const wrongRole = response(); await acceso("TRANSPORTISTA")(req, wrongRole, () => assert.fail()); assert.equal(wrongRole.statusCode, 403);
    req.externalUser.generadorId = "otra-empresa"; const cross = response(); await acceso("GENERADOR")(req, cross, () => assert.fail()); assert.equal(cross.statusCode, 403);
    doc = null; const missing = response(); await acceso("GENERADOR")(req, missing, () => assert.fail()); assert.equal(missing.statusCode, 404);
});
