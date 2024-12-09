<p align="center">
  <img src="logo.webp" alt="WildfireEye" />
</p>


# Acerca de WildfireEye
WildfireEye es una dApp, es proyecto desarrollado para contribuir al ecositema blabla mediante la detección de focos de incendio mediante el uso de drones entrenados con modelos de IA y la implementación de la blockchain.

# MVP
Actualmente WildfireEye es un MVP, que como primer paso solicita que conectes tu wallet, luego que indiques unas coordenas para el recorrido que realizará el dron asociado a tu wallet. 
Lo que hacemos es simular el descubrimiento de un foco de incendio a traves de la subida de un archivo, luego de esto la dApp mostrará que se dió aviso a las autoridades y al dueño de la address solicitando que registre la información en la blockchain confirmando la transacción, de esta manera podremos ver la nueva información actualizada en la dApp.

# Próximos pasos para WildfireEye
Dron con capacidad de programación: Muchos drones, como los de DJI (con el SDK disponible) o drones de código abierto como los basados en Pixhawk (utilizando ArduPilot o PX4), permiten este nivel de personalización.
Controlador de vuelo: Hardware que ejecuta las órdenes programadas, como Pixhawk o DJI Flight Controller.
Sensores de navegación: GPS, cámaras, sensores de proximidad o LIDAR para evitar obstáculos y seguir la ruta programada.

Software de control de vuelo:
DJI SDK: Para drones DJI.
ArduPilot o PX4: Para drones personalizados o de código abierto.
QGroundControl o Mission Planner: Interfaces gráficas para definir rutas.

## Presentación PPTX:
[doc](https://docs.google.com/presentation/d/1VGpXG9A-ZQMfA3z_Bk_wKYFaYK7Km0Bw/edit?usp=sharing&ouid=113359977998999560241&rtpof=true&sd=true)


## Investigación incendios Córdoba - Argentina (2022 - 2024):
[doc](https://drive.google.com/file/d/1PDPIzk-RAFBE-NQeGrwWsPbwamIYwo1k/view?usp=sharing)


# Guía de Instalación del MVP 

## Prerrequisitos por Sistema Operativo

### Node.js y npm

#### Windows
1. Visita [https://nodejs.org/](https://nodejs.org/)
2. Descarga e instala la versión LTS para Windows
3. Verifica la instalación en PowerShell:
```powershell
node --version
npm --version
```

#### macOS
1. Usando Homebrew:
```bash
brew install node
```
2. O descarga el instalador desde [https://nodejs.org/](https://nodejs.org/)
3. Verifica la instalación:
```bash
node --version
npm --version
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Para otras distribuciones, visita: [NodeSource Distributions](https://github.com/nodesource/distributions)

### Python

#### Windows
1. Visita [https://www.python.org/downloads/windows/](https://www.python.org/downloads/windows/)
2. Descarga el instalador Windows (64-bit)
3. Durante la instalación:
   - Marca "Add Python to PATH"
   - Marca "Install pip"
4. Verifica en PowerShell:
```powershell
python --version
pip --version
```

#### macOS
1. Usando Homebrew:
```bash
brew install python
```
2. O descarga desde [https://www.python.org/downloads/macos/](https://www.python.org/downloads/macos/)
3. Verifica:
```bash
python3 --version
pip3 --version
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3 python3-pip
python3 --version
pip3 --version
```

### Foundry

#### Windows
1. Abre PowerShell como administrador:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
scoop install git
scoop bucket add main
scoop install foundry
```

#### macOS
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

#### Linux
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### MetaMask
La instalación es similar en todos los sistemas operativos:
1. Visita [https://metamask.io/download/](https://metamask.io/download/)
2. Selecciona tu navegador e instala la extensión
3. Sigue el proceso de configuración inicial

## Configuración del Proyecto

### 1. Backend (Node.js)

#### Instalación

Windows:
```powershell
cd wildfireEye\backend\fire-detection-backend\
npm install
```

macOS/Linux:
```bash
cd wildfireEye/backend/fire-detection-backend
npm install
```

#### Variables de Entorno

Windows (PowerShell):
```powershell
New-Item .env
Add-Content .env "PORT=3000
```

macOS/Linux:
```bash
cat > .env << EOL
PORT=3000
EOL
```

#### Ejecutar el Backend

Todos los sistemas:
```bash

# Modo desarrollo
npm start
```

### 2. Smart Contracts

#### Instalación y Configuración

Todos los sistemas:
```bash
cd ../contracts/fire-detection
forge install
```

#### Variables de Entorno

Windows (PowerShell):
```powershell
New-Item .env
Add-Content .env "PRIVATE_KEY=tu_clave_privada_wallet
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
ETHERSCAN_API_KEY=tu_api_key_etherscan"
```

macOS/Linux:
```bash
cat > .env << EOL
PRIVATE_KEY=tu_clave_privada_wallet
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
ETHERSCAN_API_KEY=tu_api_key_etherscan
EOL
```

#### Iniciar Blockchain Local (Anvil) o en Aribitrum Sepolia

Todos los sistemas:
```bash
# Iniciar Anvil En el caso de que se desee trabajar local
anvil
```

#### Compilar y Desplegar

Todos los sistemas:
```bash
# Compilar
forge build

# Desplegar en Anvil (local)
forge script script/DeployFireDetection.s.sol:DeployFireDetection \
    --rpc-url http://localhost:8545/ \
    --private-key mi_clave_privada \
    --broadcast

# Desplegar en Arbitrum Sepolia
forge script script/DeployFireDetection.s.sol --rpc-url arbitrum-sepolia --broadcast --verify --sender mi_address --private-key mi_clave_privada

# Enviar gas desde Anvil a mi Wallet (tanto las address como las private_key son estandards)
cast send --from address_anvil --private-key private_key_anvil --value 10000000000000000000 mi_address

```

### 3. Frontend (Servidor HTTP Python)

#### Preparación del Servidor

Windows:
```powershell
cd ..\frontend
```

macOS/Linux:
```bash
cd ../frontend
```

#### Ejecutar el Servidor Frontend

Windows:
```powershell
# Python 3.x
python -m http.server
```

macOS/Linux:
```bash
# Python 3.x
python3 -m http.server
```

Acceder al frontend en: `http://localhost:8080`

## Configuración de Redes en MetaMask

### 1. Red Local (Anvil)
- Nombre de la red: Anvil Local
- Nueva URL de RPC: http://localhost:8545
- ID de cadena: 31337
- Símbolo de la moneda: ETH

### 3. Arbitrum Sepolia
- Nombre de la red: Arbitrum Sepolia
- Nueva URL de RPC: https://sepolia-rollup.arbitrum.io/rpc
- ID de cadena: 421614
- Símbolo de la moneda: ETH
- Explorador de bloques: https://sepolia.arbiscan.io/


## Obtener Tokens de Prueba

### Sepolia
1. Faucet oficial: [https://sepoliafaucet.com/](https://sepoliafaucet.com/)
2. Alchemy Faucet: [https://sepoliafaucet.com/](https://sepoliafaucet.com/)

### Arbitrum Sepolia
1. Faucet oficial: [https://faucet.arbitrum.io/](https://faucet.arbitrum.io/)

## Recursos Adicionales

### Documentación
- Foundry: [https://book.getfoundry.sh/](https://book.getfoundry.sh/)
- Arbitrum Docs: [https://docs.arbitrum.io/](https://docs.arbitrum.io/)
- Sepolia Testnet: [https://sepolia.dev/](https://sepolia.dev/)

### Exploradores de Bloques
- Arbitrum Sepolia: [https://sepolia.arbiscan.io/](https://sepolia.arbiscan.io/)

## Licencia
Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE.md para más detalles.


