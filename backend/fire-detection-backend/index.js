const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Multer para manejar fotos subidas
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("¡Backend funcionando!");
});

// Ruta para recibir planificación del recorrido
app.post("/route", (req, res) => {
    const { waypoints } = req.body;

    if (!waypoints || waypoints.length === 0) {
        return res.status(400).json({ message: "Los waypoints son necesarios." });
    }

    console.log("Waypoints recibidos:", waypoints);
    res.json({ message: "Planificación de recorrido recibida." });
});

// Ruta para subir fotos
app.post("/upload", upload.single("photo"), async (req, res) => {
    try {
        const filePath = req.file.path;
        console.log("Foto recibida:", filePath);

        // Simulación de detección de fuego según el nombre del archivo
        const fireDetected = await simulateFireDetection(req.file.originalname);

        if (fireDetected) {
            res.json({ message: "Fuego detectado en la imagen.", fire: true });
        } else {
            res.json({ message: "No se detectó fuego en la imagen.", fire: false });
        }
    } catch (error) {
        console.error("Error al analizar la imagen:", error);
        res.status(500).json({ message: "Error al analizar la imagen." });
    }
});

// Función para simular la detección de fuego según el nombre del archivo
async function simulateFireDetection(fileName) {
    try {
        // Simula detección de fuego basado en el nombre del archivo
        if (fileName === "2.jpg") {
            return true;  // Detecta fuego si el archivo es "2.jpg"
        } else if (fileName === "1.jpg") {
            return false; // No detecta fuego si el archivo es "1.jpg"
        } else {
            // Para otros archivos, puedes agregar más lógica o considerarlo como "sin detección"
            return false;
        }
    } catch (error) {
        console.error("Error en la simulación de detección:", error);
        return false;
    }
}

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

