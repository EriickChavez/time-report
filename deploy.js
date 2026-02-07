const { execSync } = require("child_process");

const APP_NAME = "time-report";
// En Next.js, para PM2 ejecutamos el comando "npm start"
const START_COMMAND = "npm start";

function run(command) {
  try {
    console.log(`\n🏃 Ejecutando: ${command}`);
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`\n❌ Error al ejecutar: ${command}`);
    process.exit(1);
  }
}

console.log(`🚀 Iniciando despliegue de ${APP_NAME}...`);

// 1. Instalar dependencias
run("npm install");

// 2. Generar cliente de Prisma (Crucial para que las consultas funcionen)
console.log("\n💎 Generando cliente de Prisma...");
run("npx prisma generate");

// 3. Compilar la aplicación (Next.js Build)
console.log("\n🏗️  Compilando Next.js...");
run("npm run build");

// 4. Manejo de PM2
try {
  console.log(`\n♻️  Intentando reiniciar ${APP_NAME}...`);
  execSync(`pm2 restart ${APP_NAME}`, { stdio: "inherit" });
} catch (e) {
  console.log(`\n🆕 Iniciando por primera vez con PM2...`);
  // Usamos -- para pasar los argumentos al script de npm
  run(`pm2 start npm --name "${APP_NAME}" -- start`);
}

// 5. Persistencia
run("pm2 save");

console.log(`\n✅ ¡Despliegue de Next.js completado con éxito!`);
