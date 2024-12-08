// -------------- VERSION 4
document.addEventListener("DOMContentLoaded", () => {
    const connectWalletBtn = document.getElementById("connectWalletBtn");
    const walletAddressDiv = document.getElementById("walletAddress");
    const dashboard = document.getElementById("dashboard");
    const routeForm = document.getElementById("routeForm");
    const uploadForm = document.getElementById("uploadForm");
    const photoInput = document.getElementById("photo");
    const messageDiv = document.createElement("div"); // Div para mostrar mensajes
    const reportsSection = document.getElementById("reports-section");
    const reportsList = document.getElementById("reports-list");
    const refreshReportsBtn = document.getElementById("refresh-reports");

    // Función para mostrar los reportes
    async function displayReports() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
            
            // Obtener todos los reportes
            const reports = await contract.getReports();
            
            // Limpiar la lista actual
            reportsList.innerHTML = '';
            
            // Crear elementos HTML para cada reporte
            reports.forEach((report, index) => {
                const reportElement = document.createElement('div');
                reportElement.className = 'card';
                
                // Formatear los waypoints para mostrarlos
                const waypointsHtml = report[1].map(wp => `<li>${wp}</li>`).join('');
                
                reportElement.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">Reporte #${index + 1}</h5>
                        <p class="card-text"><strong>Mensaje:</strong> ${report[0]}</p>
                        <p class="card-text"><strong>Waypoints:</strong></p>
                        <ul>${waypointsHtml}</ul>
                        <p class="card-text"><small class="text-muted">Reportado por: ${report[2]}</small></p>
                    </div>
                `;
                
                reportsList.appendChild(reportElement);
            });
            
            // Mostrar la sección de reportes
            reportsSection.style.display = "block";
            
            showMessage("Reportes actualizados exitosamente", "success");
        } catch (error) {
            console.error("Error al obtener reportes:", error);
            showMessage("Error al obtener reportes: " + error.message, "error");
        }
    }

    // Evento para actualizar reportes
    refreshReportsBtn.addEventListener("click", displayReports);
    document.body.appendChild(messageDiv);

    const showMessage = (message, type = "info") => {
        // Limpia cualquier mensaje anterior
        messageDiv.innerHTML = "";
        messageDiv.style.padding = "10px";
        messageDiv.style.margin = "10px 0";
        messageDiv.style.border = "1px solid";
        messageDiv.style.borderRadius = "5px";
        messageDiv.style.color = type === "error" ? "red" : "green";
        messageDiv.style.backgroundColor = type === "error" ? "#fdd" : "#dfd";
        messageDiv.textContent = message;
    };

    // Verificar si MetaMask está instalado
    if (typeof window.ethereum === "undefined") {
        showMessage("MetaMask no está instalado. Por favor, instálalo para continuar.", "error");
        return;
    }

    // Función para cambiar la red a localhost:8545
    const switchToLocalNetwork = async () => {
        try {
            // Verificar la red actual
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId === '0x7A69') { // Si ya estamos en la red local (31337)
                return true;
            }

            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0x7A69', // 31337 en hexadecimal
                    chainName: 'Anvil Local',
                    nativeCurrency: {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18
                    },
                    rpcUrls: ['http://localhost:8545']
                }]
            });
            showMessage("Red local configurada correctamente", "success");
            return true;
        } catch (error) {
            console.error("Error al configurar la red local:", error);
            showMessage("Error al configurar la red local: " + error.message, "error");
            return false;
        }
    };

    // Conectar MetaMask
    connectWalletBtn.addEventListener("click", async () => {
        try {
            // Primero intentar obtener las cuentas
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            const walletAddress = accounts[0];
            
            // Luego cambiar la red si es necesario
            await switchToLocalNetwork();
            
            walletAddressDiv.style.display = "block";
            walletAddressDiv.textContent = `Wallet Conectada: ${walletAddress}`;
            dashboard.style.display = "block";
            showMessage("Wallet conectada exitosamente.");
            
            // Mostrar reportes existentes
            await displayReports();
        } catch (error) {
            console.error("Error al conectar MetaMask:", error);
            showMessage("Error al conectar MetaMask: " + error.message, "error");
        }
    });

    // Manejar el envío del formulario de planificación de recorrido
    routeForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const waypoints = [
            document.getElementById("waypoint1").value,
            document.getElementById("waypoint2").value,
        ];
        try {
            const response = await fetch("http://localhost:3000/route", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ waypoints }),
            });
            const result = await response.json();
            if (response.ok) {
                showMessage(result.message);
            } else {
                showMessage(result.message, "error");
            }
        } catch (error) {
            console.error("Error al enviar la planificación:", error);
            showMessage("Error al enviar la planificación de recorrido.", "error");
        }
    });

    const CONTRACT_ADDRESS = "0x315007Bb8f69750456F942ceaA1f7da90288ed6C";
    const ABI = [
        {
            "type": "function",
            "name": "fireReports",
            "inputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "message",
                    "type": "string",
                    "internalType": "string"
                },
                {
                    "name": "reporter",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "getReports",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "tuple[]",
                    "internalType": "struct FireDetection.FireReport[]",
                    "components": [
                        {
                            "name": "message",
                            "type": "string",
                            "internalType": "string"
                        },
                        {
                            "name": "waypoints",
                            "type": "string[]",
                            "internalType": "string[]"
                        },
                        {
                            "name": "reporter",
                            "type": "address",
                            "internalType": "address"
                        }
                    ]
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "reportFire",
            "inputs": [
                {
                    "name": "message",
                    "type": "string",
                    "internalType": "string"
                },
                {
                    "name": "waypoints",
                    "type": "string[]",
                    "internalType": "string[]"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "event",
            "name": "FireReported",
            "inputs": [
                {
                    "name": "reporter",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "message",
                    "type": "string",
                    "indexed": false,
                    "internalType": "string"
                },
                {
                    "name": "waypoints",
                    "type": "string[]",
                    "indexed": false,
                    "internalType": "string[]"
                }
            ],
            "anonymous": false
        }
    ];
    
    // Manejar la subida de fotos
    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("photo", photoInput.files[0]);

        try {
            const response = await fetch("http://localhost:3000/upload", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (result.fire) {
                showMessage(result.message);
                
                // Crear y mostrar el botón para reportar a la blockchain
                const reportButton = document.createElement("button");
                reportButton.textContent = "Reportar Fuego en Blockchain";
                reportButton.className = "report-fire-btn";
                messageDiv.appendChild(reportButton);

                // Manejar el click del botón
                reportButton.addEventListener("click", async () => {
                    try {
                        const provider = new ethers.providers.Web3Provider(window.ethereum);
                        const signer = provider.getSigner();
                        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

                        // Obtener los waypoints actuales
                        const waypoints = [
                            document.getElementById("waypoint1").value,
                            document.getElementById("waypoint2").value,
                        ];

                        // Enviar la transacción
                        const tx = await contract.reportFire("Fuego detectado", waypoints);
                        showMessage("Enviando transacción a la blockchain...", "info");
                        
                        // Guardar el recibo de la transacción
                        const receipt = await tx.wait();
                        
                        showMessage(`¡Reporte de fuego registrado exitosamente!
                            Hash: ${receipt.transactionHash}
                            Bloque: ${receipt.blockNumber}
                            Gas usado: ${receipt.gasUsed.toString()}`, "success");
                        
                        // Actualizar la lista de reportes
                        await displayReports();
                        
                        // Deshabilitar el botón después de reportar
                        reportButton.disabled = true;
                        reportButton.textContent = "Fuego Reportado";
                    } catch (error) {
                        console.error("Error al reportar en la blockchain:", error);
                        showMessage("Error al reportar en la blockchain: " + error.message, "error");
                    }
                });
            } else {
                showMessage(result.message);
            }
        } catch (error) {
            console.error("Error al subir la foto:", error);
            showMessage("Error al subir la foto.", "error");
        }
    });
});
