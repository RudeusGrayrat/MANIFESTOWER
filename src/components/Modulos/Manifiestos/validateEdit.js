export const deepDiff = (obj1, obj2) => {
  let diff = {};

  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      // Detectamos si el valor es un archivo
      const isFile = obj2[key] instanceof File;

      if (
        isFile || // Si es un archivo, lo consideramos automáticamente como un cambio
        !obj1.hasOwnProperty(key) || // Si la clave no existe en obj1
        !deepEqual(obj1[key], obj2[key]) // Si los valores son diferentes
      ) {
        if (
          typeof obj2[key] === "object" &&
          obj2[key] !== null &&
          !Array.isArray(obj2[key]) &&
          !isFile
        ) {
          const innerDiff = deepDiff(obj1[key] || {}, obj2[key]);
          if (Object.keys(innerDiff).length > 0) {
            diff[key] = innerDiff; // Guardamos el objeto completo si hay algún cambio
          }
        } else {
          diff[key] = obj2[key]; // Guardamos el valor de la propiedad que ha cambiado
        }
      }
    }
  }

  return diff;
};

// Función auxiliar para comparar valores de manera profunda (deep comparison)
export const deepEqual = (val1, val2) => {
  if (val1 === val2) return true; // Si son estrictamente iguales
  if (
    typeof val1 !== "object" ||
    typeof val2 !== "object" ||
    val1 == null ||
    val2 == null
  ) {
    return false; // Si no son objetos o son null
  }

  const keys1 = Object.keys(val1);
  const keys2 = Object.keys(val2);

  if (keys1.length !== keys2.length) return false; // Si tienen diferente número de claves

  // Comprobamos cada clave recursivamente
  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(val1[key], val2[key])) {
      return false; // Si alguna clave o valor no coincide
    }
  }
  return true;
};

export const simpleDiff = (obj1, obj2, campo) => {
  let diff = {};

  // Comparar solo la primera capa de las propiedades
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      // Si el valor de "colaborator" cambia, se devuelve el objeto completo "colaborator"
      const comparacion = campo ? campo : "colaborador";
      if (key === comparacion && !deepEqual(obj1[key], obj2[key])) {
        diff[key] = obj2[key];
      }
    }
  }

  return diff;
};
