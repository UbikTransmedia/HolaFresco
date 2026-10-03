/* Persistencia local (localStorage) con copia de seguridad en memoria si no está disponible. */
(function () {
  "use strict";
  const PREFIJO = "recetador."; // prefijo histórico (antes de llamarse HolaFresco): se conserva para no perder datos guardados
  const memoria = {};

  const disponible = (() => {
    try {
      const k = PREFIJO + "__test";
      localStorage.setItem(k, "1");
      localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  })();

  const leer = (clave, porDefecto) => {
    try {
      const raw = disponible ? localStorage.getItem(PREFIJO + clave) : memoria[clave];
      if (raw == null) return typeof porDefecto === "function" ? porDefecto() : porDefecto;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("No se pudo leer", clave, e);
      return typeof porDefecto === "function" ? porDefecto() : porDefecto;
    }
  };

  const guardar = (clave, valor) => {
    const raw = JSON.stringify(valor);
    try {
      if (disponible) localStorage.setItem(PREFIJO + clave, raw);
      else memoria[clave] = raw;
    } catch (e) {
      console.error("No se pudo guardar", clave, e);
      window.UI && window.UI.toast && window.UI.toast("No se pudo guardar: el almacenamiento está lleno o bloqueado.", "error");
    }
  };

  const borrar = (clave) => {
    if (disponible) localStorage.removeItem(PREFIJO + clave);
    else delete memoria[clave];
  };

  const uid = (prefijo = "id") => prefijo + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);

  const exportarTodo = () => {
    const claves = ["personas", "menus", "recetasPropias", "recetasOverrides", "recetasBorradas", "ajustes", "borradorWizard", "favoritos", "listaNegra", "filtrosRecetas"];
    const datos = { app: "HolaFresco", version: 1, fecha: new Date().toISOString() };
    for (const k of claves) datos[k] = leer(k, null);
    return datos;
  };

  const importarTodo = (datos) => {
    if (!datos || !["HolaFresco", "Recetador"].includes(datos.app)) throw new Error("El fichero no parece una copia de HolaFresco.");
    for (const k of Object.keys(datos)) {
      if (["app", "version", "fecha"].includes(k)) continue;
      if (datos[k] != null) guardar(k, datos[k]);
    }
  };

  window.DB = { leer, guardar, borrar, uid, disponible, exportarTodo, importarTodo };
})();
