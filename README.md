# wildfireEye
dApp para monitorear focos de incendio con drones, IA y blockchain

# Guía de Instalación

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
cd wildfireEye\backend
npm install
```

macOS/Linux:
```bash
cd wildfireEye/backend
npm install
```

#### Variables de Entorno

Windows (PowerShell):
```powershell
New-Item .env
Add-Content .env "PORT=3000
API_KEY=tu_clave_api
PINATA_API_KEY=tu_clave_pinata
PINATA_SECRET_KEY=tu_clave_secreta_pinata"
```

macOS/Linux:
```bash
cat > .env << EOL
PORT=3000
API_KEY=tu_clave_api
PINATA_API_KEY=tu_clave_pinata
PINATA_SECRET_KEY=tu_clave_secreta_pinata
EOL
```

#### Ejecutar el Backend

Todos los sistemas:
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

### 2. Smart Contracts

#### Instalación y Configuración

Todos los sistemas:
```bash
cd ../contracts
forge install
```

#### Variables de Entorno

Windows (PowerShell):
```powershell
New-Item .env
Add-Content .env "PRIVATE_KEY=tu_clave_privada_wallet
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/tu_proyecto_id
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
ETHERSCAN_API_KEY=tu_api_key_etherscan"
```

macOS/Linux:
```bash
cat > .env << EOL
PRIVATE_KEY=tu_clave_privada_wallet
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/tu_proyecto_id
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
ETHERSCAN_API_KEY=tu_api_key_etherscan
EOL
```

#### Iniciar Blockchain Local (Anvil)

Todos los sistemas:
```bash
# Iniciar Anvil con 10 cuentas y 10000 ETH cada una
anvil --accounts 10 --balance 10000
```

#### Compilar y Desplegar

Todos los sistemas:
```bash
# Compilar
forge build

# Desplegar en Anvil (local)
forge script script/Deploy.s.sol:Deploy --rpc-url http://localhost:8545 --broadcast

# Desplegar en Sepolia
forge script script/Deploy.s.sol:Deploy --rpc-url $SEPOLIA_RPC_URL --broadcast --verify -vvvv

# Desplegar en Arbitrum Sepolia
forge script script/Deploy.s.sol:Deploy --rpc-url $ARBITRUM_SEPOLIA_RPC_URL --broadcast --verify -vvvv
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
python -m http.server 8080

# Python 2.x (si es necesario)
python -m SimpleHTTPServer 8080
```

macOS/Linux:
```bash
# Python 3.x
python3 -m http.server 8080

# Python 2.x (si es necesario)
python -m SimpleHTTPServer 8080
```

Acceder al frontend en: `http://localhost:8080`

## Configuración de Redes en MetaMask

### 1. Red Local (Anvil)
- Nombre de la red: Anvil Local
- Nueva URL de RPC: http://localhost:8545
- ID de cadena: 31337
- Símbolo de la moneda: ETH

### 2. Sepolia Testnet
- Nombre de la red: Sepolia
- Nueva URL de RPC: https://sepolia.infura.io/v3/
- ID de cadena: 11155111
- Símbolo de la moneda: SEP
- Explorador de bloques: https://sepolia.etherscan.io

### 3. Arbitrum Sepolia
- Nombre de la red: Arbitrum Sepolia
- Nueva URL de RPC: https://sepolia-rollup.arbitrum.io/rpc
- ID de cadena: 421614
- Símbolo de la moneda: ETH
- Explorador de bloques: https://sepolia.arbiscan.io/

## Flujo de Trabajo Completo

1. **Iniciar Backend**
```bash
cd backend
npm run dev
```

2. **Iniciar Blockchain Local**
```bash
cd contracts
anvil
```

3. **Desplegar Contratos**
En una nueva terminal:
```bash
cd contracts

# Local
forge script script/Deploy.s.sol:Deploy --rpc-url http://localhost:8545 --broadcast

# O en Sepolia/Arbitrum (asegúrate de tener fondos en la wallet)
forge script script/Deploy.s.sol:Deploy --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
```

4. **Iniciar Frontend**
```bash
cd frontend
python3 -m http.server 8080
```

## Solución de Problemas Comunes

### Backend (Node.js)
```bash
# Error de dependencias
rm -rf node_modules package-lock.json
npm install

# Error de permisos
sudo chown -R $USER ~/.npm
```

### Contratos (Foundry)
```bash
# Error de compilación
forge clean
forge build --force

# Error de nonce en MetaMask
# Reset cuenta en MetaMask: Configuración > Avanzado > Reset Account
```

### Frontend (Servidor Python)
```bash
# Puerto en uso
# Intenta con otro puerto
python3 -m http.server 8081

# Error de permisos
sudo python3 -m http.server 80  # Si necesitas usar el puerto 80
```

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
- Sepolia: [https://sepolia.etherscan.io/](https://sepolia.etherscan.io/)
- Arbitrum Sepolia: [https://sepolia.arbiscan.io/](https://sepolia.arbiscan.io/)

## Licencia
Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE.md para más detalles.
