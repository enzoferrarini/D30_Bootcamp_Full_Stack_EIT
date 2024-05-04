import prompt from "prompt-sync";
import fs, { constants } from "node:fs";
import cls from "colors";
import { Buffer } from "node:buffer";

const promptFunc = prompt();

export const fileController = () => {
  let action;

  do {
    console.log(cls.yellow("Seleccione la acción a realizar:"));
    action = promptFunc(
      cls.yellow(
        "(Lectura: R, Edición: E, Creación: C, Eliminar: D, Salir: Q): "
      )
    );
  } while (
    !(
      action === "R" ||
      action === "E" ||
      action === "C" ||
      action === "D" ||
      action === "Q"
    )
  );

  if (action === "Q") {
    return;
  }

  const fileName = promptFunc(
    cls.blue("Por favor, ingrese el nombre del archivo y su extensión: ")
  );
  const dirName = `./files/${fileName}`;

  switch (action) {
    case "R":
      //LEER ARCHIVO----------------------------
      fs.access(dirName, constants.R_OK, (error) => {
        if (error) {
          console.log(cls.red(`El Archivo ${fileName} no pudo ser leído...`));
        } else {
          console.log(cls.blue(`Contenido del Archivo ${fileName}:`));
          const file = fs.readFileSync(dirName);
          const data = file.toString();
          console.log(cls.green(data));
        }
      });
      break;
    case "C":
      //CREAR ARCHIVO----------------------------
      const data = promptFunc(
        cls.blue("A continuación ingrese el contenido del Archivo:")
      );
      const buffer = new Uint8Array(Buffer.from(data));

      try {
        fs.writeFileSync(dirName, buffer);
        console.log(
          cls.green(`El archivo ${fileName} se ha creado correctamente...`)
        );
      } catch (error) {
        console.log(
          cls.red(
            `ERROR al crear el archivo ${fileName}, inténtelo más tarde...`
          )
        );
      }
      break;
    case "E":
      //EDITAR ARCHIVO----------------------------
      fs.access(dirName, constants.R_OK | constants.W_OK, (error) => {
        if (error) {
          console.log(
            cls.red(
              `El archivo ${fileName} no se puede leer y/o no se puede escribir...`
            )
          );
        } else {
          const finalData = promptFunc(
            cls.blue("A continuación ingrese el NUEVO contenido del Archivo:")
          );
          const buffer = new Uint8Array(Buffer.from(finalData));
          try {
            fs.writeFileSync(dirName, buffer);
            console.log(
              cls.green(
                `El archivo ${fileName} ha sido modificado correctamente...`
              )
            );
          } catch (error) {
            console.log(
              cls.red(
                `ERROR al modificar el archivo ${fileName}, inténtelo más tarde...`
              )
            );
          }
        }
      });
      break;
    case "D":
      //ELIMINAR ARCHIVO----------------------------
      fs.rm(dirName, (error) => {
        if (error) {
          console.log(
            cls.red(
              `ERROR al eliminar el archivo ${fileName}, inténtelo más tarde...`
            )
          );
        } else
          console.log(
            cls.green(
              `El archivo ${fileName} ha sido eliminado correctamente...`
            )
          );
      });
      break;
    default:
      break;
  }
};
