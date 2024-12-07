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

    // Configuración del contrato (ajusta la dirección según tu despliegue local)
    const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
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

// -------------- VERSION 3
// document.addEventListener("DOMContentLoaded", () => {
//     const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
//     const ABI = [
//         {
//             "type": "function",
//             "name": "fireReports",
//             "inputs": [
//               {
//                 "name": "",
//                 "type": "uint256",
//                 "internalType": "uint256"
//               }
//             ],
//             "outputs": [
//               {
//                 "name": "message",
//                 "type": "string",
//                 "internalType": "string"
//               },
//               {
//                 "name": "reporter",
//                 "type": "address",
//                 "internalType": "address"
//               }
//             ],
//             "stateMutability": "view"
//         },
//         {
//             "type": "function",
//             "name": "getReports",
//             "inputs": [],
//             "outputs": [
//               {
//                 "name": "",
//                 "type": "tuple[]",
//                 "internalType": "struct FireDetection.FireReport[]",
//                 "components": [
//                     {
//                         "name": "message",
//                         "type": "string",
//                         "internalType": "string"
//                     },
//                     {
//                         "name": "waypoints",
//                         "type": "string[]",
//                         "internalType": "string[]"
//                     },
//                     {
//                         "name": "reporter",
//                         "type": "address",
//                         "internalType": "address"
//                     }
//                 ]
//               }
//             ],
//             "stateMutability": "view"
//         },
//         {
//             "type": "function",
//             "name": "reportFire",
//             "inputs": [
//                 {
//                     "name": "message",
//                     "type": "string",
//                     "internalType": "string"
//                 },
//                 {
//                     "name": "waypoints",
//                     "type": "string[]",
//                     "internalType": "string[]"
//                 }
//             ],
//             "outputs": [],
//             "stateMutability": "nonpayable"
//         },
//         {
//             "type": "event",
//             "name": "FireReported",
//             "inputs": [
//                 {
//                     "name": "reporter",
//                     "type": "address",
//                     "indexed": true,
//                     "internalType": "address"
//                 },
//                 {
//                     "name": "message",
//                     "type": "string",
//                     "indexed": false,
//                     "internalType": "string"
//                 },
//                 {
//                     "name": "waypoints",
//                     "type": "string[]",
//                     "indexed": false,
//                     "internalType": "string[]"
//                 }
//             ],
//             "anonymous": false
//         },
//         {
//             "bytecode": {
//                 "object": "0x6080604052348015600e575f80fd5b506109ae8061001c5f395ff3fe608060405234801561000f575f80fd5b506004361061003f575f3560e01c806307c7d5651461004357806324d571f61461006d578063a3c86daf14610082575b5f80fd5b6100566100513660046104c6565b610097565b60405161006492919061050b565b60405180910390f35b61008061007b3660046105e5565b610154565b005b61008a610234565b60405161006491906106de565b5f81815481106100a5575f80fd5b905f5260205f2090600302015f91509050805f0180546100c4906107c4565b80601f01602080910402602001604051908101604052809291908181526020018280546100f0906107c4565b801561013b5780601f106101125761010080835404028352916020019161013b565b820191905f5260205f20905b81548152906001019060200180831161011e57829003601f168201915b505050600290930154919250506001600160a01b031682565b604080516060810182528381526020810183905233918101919091525f8054600181018255908052815182916003027f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563019081906101b29082610848565b5060208281015180516101cb9260018501920190610408565b5060409182015160029190910180546001600160a01b0319166001600160a01b039092169190911790555133907f531a5ca24f49483cf4d048afacd369ce678bc5aeb6f67cf4c500bece5b32a975906102279086908690610903565b60405180910390a2505050565b60605f805480602002602001604051908101604052809291908181526020015f905b828210156103ff578382905f5260205f2090600302016040518060600160405290815f82018054610286906107c4565b80601f01602080910402602001604051908101604052809291908181526020018280546102b2906107c4565b80156102fd5780601f106102d4576101008083540402835291602001916102fd565b820191905f5260205f20905b8154815290600101906020018083116102e057829003601f168201915b5050505050815260200160018201805480602002602001604051908101604052809291908181526020015f905b828210156103d2578382905f5260205f20018054610347906107c4565b80601f0160208091040260200160405190810160405280929190818152602001828054610373906107c4565b80156103be5780601f10610395576101008083540402835291602001916103be565b820191905f5260205f20905b8154815290600101906020018083116103a157829003601f168201915b50505050508152602001906001019061032a565b50505090825250600291909101546001600160a01b03166020918201529082526001929092019101610256565b50505050905090565b828054828255905f5260205f2090810192821561044c579160200282015b8281111561044c578251829061043c9082610848565b5091602001919060010190610426565b5061045892915061045c565b5090565b80821115610458575f61046f8282610478565b5060010161045c565b508054610484906107c4565b5f825580601f10610493575050565b601f0160209004905f5260205f20908101906104af91906104b2565b50565b5b80821115610458575f81556001016104b3565b5f602082840312156104d6575f80fd5b5035919050565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b604081525f61051d60408301856104dd565b905060018060a01b03831660208301529392505050565b634e487b7160e01b5f52604160045260245ffd5b604051601f8201601f1916810167ffffffffffffffff8111828210171561057157610571610534565b604052919050565b5f82601f830112610588575f80fd5b813567ffffffffffffffff8111156105a2576105a2610534565b6105b5601f8201601f1916602001610548565b8181528460208386010111156105c9575f80fd5b816020850160208301375f918101602001919091529392505050565b5f80604083850312156105f6575f80fd5b823567ffffffffffffffff81111561060c575f80fd5b61061885828601610579565b925050602083013567ffffffffffffffff811115610634575f80fd5b8301601f81018513610644575f80fd5b803567ffffffffffffffff81111561065e5761065e610534565b8060051b61066e60208201610548565b91825260208184018101929081019088841115610689575f80fd5b6020850192505b838310156106cf57823567ffffffffffffffff8111156106ae575f80fd5b6106bd8a602083890101610579565b83525060209283019290910190610690565b80955050505050509250929050565b5f602082016020835280845180835260408501915060408160051b8601019250602086015f5b5f82819052915b5b508e5093501a8fbb9e975c711fbb8ed3252a840ebac034ba0b34edfff685aaf2c552d9738df29c39d19908fa70908d6b57da755f8de0bc65a2dcdbffb82368b7b7e4e7088ae2e39d199ba1b48c0f4ff27b07425cddf40bfe5b370c9679d245"
//             } 
//         }     
//     ];

//     let account;
//     let contract;

//     const connectWalletBtn = document.getElementById("connectWalletBtn");
//     const walletAddressDiv = document.getElementById("walletAddress");
//     const dashboardDiv = document.getElementById("dashboard");
//     const routeForm = document.getElementById("routeForm");
//     const uploadForm = document.getElementById("uploadForm");

//     // Sistema de notificaciones
//     const showMessage = (message, type = "success") => {
//         const messageDiv = document.createElement("div");
//         messageDiv.className = 'message-div';
//         messageDiv.style.padding = "10px";
//         messageDiv.style.margin = "10px 0";
//         messageDiv.style.borderRadius = "5px";
//         messageDiv.style.color = type === "error" ? "red" : type === "info" ? "blue" : "green";
//         messageDiv.style.backgroundColor = type === "error" ? "#fdd" : type === "info" ? "#ddf" : "#dfd";
//         messageDiv.textContent = message;
        
//         // Insertar el mensaje después del formulario
//         const forms = document.querySelector("#dashboard");
//         forms.insertBefore(messageDiv, forms.firstChild);
        
//         // Eliminar mensajes anteriores del mismo tipo
//         const oldMessages = document.querySelectorAll(`.message-div[data-type="${type}"]`);
//         oldMessages.forEach(msg => {
//             if (msg !== messageDiv) msg.remove();
//         });
        
//         messageDiv.dataset.type = type;
        
//         // Eliminar el mensaje después de 5 segundos solo si no es tipo "info"
//         if (type !== "info") {
//             setTimeout(() => messageDiv.remove(), 5000);
//         }
        
//         return messageDiv;
//     };

//     // Verificar si MetaMask está instalado
//     const checkMetaMask = () => {
//         if (typeof window.ethereum !== "undefined") {
//             console.log("MetaMask detectado");
//             connectWalletBtn.addEventListener("click", connectWallet);
//         } else {
//             showMessage("MetaMask no está instalado. Por favor, instálalo.", "error");
//         }
//     };

//     // Conectar a MetaMask
//     const connectWallet = async () => {
//         const loadingMsg = showMessage("Conectando con MetaMask...", "info");
//         try {
//             const accounts = await ethereum.request({ method: "eth_requestAccounts" });
//             // Removemos el mensaje de "Conectando..."
//             loadingMsg.remove();
            
//             if (accounts && accounts[0]) {
//                 account = accounts[0];
//                 walletAddressDiv.innerText = `Dirección: ${account}`;
//                 walletAddressDiv.style.display = "block";
//                 connectWalletBtn.style.display = "none";
//                 dashboardDiv.style.display = "block";
//                 initializeContract();
//                 showMessage("Wallet conectada exitosamente.");
//             } else {
//                 showMessage("No se pudo obtener la dirección de la wallet.", "error");
//             }
//         } catch (error) {
//             // Removemos el mensaje de "Conectando..." si hay error
//             loadingMsg.remove();
//             console.error("Error al conectar con MetaMask:", error);
//             showMessage("Error al conectar con MetaMask. Por favor, inténtalo de nuevo.", "error");
//         }
//     };

//     // Inicializar el contrato
//     const initializeContract = () => {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();
//         contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
//     };

//     // Enviar los puntos de interés (waypoints) y registrar en blockchain
//     routeForm.addEventListener("submit", async (event) => {
//         event.preventDefault();
//         const waypoint1 = document.getElementById("waypoint1").value;
//         const waypoint2 = document.getElementById("waypoint2").value;
//         const waypoints = [waypoint1, waypoint2];
//         const message = "Posibles focos de incendio detectados";
        
//         const loadingMsg = showMessage("Procesando información...", "info");
        
//         try {
//             // Intentamos registrar en blockchain primero
//             const tx = await contract.reportFire(message, waypoints);
//             await tx.wait();
            
//             // Luego intentamos enviar al backend si está disponible
//             try {
//                 const response = await fetch("http://localhost:3000/route", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ waypoints }),
//                 });
//                 const result = await response.json();
//                 if (response.ok) {
//                     showMessage("Información registrada en blockchain y backend exitosamente.");
//                 }
//             } catch (backendError) {
//                 // Si el backend falla, igual continuamos porque ya se registró en blockchain
//                 console.warn("Backend no disponible:", backendError);
//                 showMessage("Información registrada en blockchain exitosamente (backend no disponible).");
//             }
//         } catch (error) {
//             console.error("Error al procesar la información:", error);
//             showMessage("Error al registrar la información.", "error");
//         } finally {
//             loadingMsg.remove();
//         }
//     });

//     // Subir y procesar foto
//     uploadForm.addEventListener("submit", async (event) => {
//         event.preventDefault();
//         const photo = document.getElementById("photo").files[0];
//         if (!photo) {
//             showMessage("Por favor selecciona una foto.", "error");
//             return;
//         }

//         const loadingMsg = showMessage("Procesando foto...", "info");
        
//         try {
//             // Primero intentamos procesar localmente
//             const message = "Fuego detectado en imagen";
//             const waypoints = []; // Coordenadas por defecto si no hay backend
            
//             // Intentamos usar el backend si está disponible
//             try {
//                 const formData = new FormData();
//                 formData.append("photo", photo);
//                 const response = await fetch("http://localhost:3000/upload", {
//                     method: "POST",
//                     body: formData,
//                 });
//                 const result = await response.json();
                
//                 if (result.fire) {
//                     // Si hay coordenadas del backend, las usamos
//                     if (result.coordinates) {
//                         waypoints.push(...result.coordinates);
//                     }
//                 }
//             } catch (backendError) {
//                 console.warn("Backend no disponible:", backendError);
//             }
            
//             // Registramos en blockchain
//             const tx = await contract.reportFire(message, waypoints);
//             await tx.wait();
//             showMessage("Foto procesada y registrada en blockchain exitosamente.");
            
//         } catch (error) {
//             console.error("Error al procesar la foto:", error);
//             showMessage("Error al procesar la foto.", "error");
//         } finally {
//             loadingMsg.remove();
//         }
//     });

//     // Comprobar si MetaMask está instalado
//     checkMetaMask();
// });

// --------- VERSION 2
// document.addEventListener("DOMContentLoaded", () => {
//     const connectWalletBtn = document.getElementById("connectWalletBtn");
//     const walletAddressDiv = document.getElementById("walletAddress");
//     const dashboard = document.getElementById("dashboard");
//     const routeForm = document.getElementById("routeForm");
//     const uploadForm = document.getElementById("uploadForm");
//     const photoInput = document.getElementById("photo");
//     const messageDiv = document.createElement("div"); // Div para mostrar mensajes
//     document.body.appendChild(messageDiv);

//     const showMessage = (message, type = "info") => {
//         // Limpia cualquier mensaje anterior
//         messageDiv.innerHTML = "";
//         messageDiv.style.padding = "10px";
//         messageDiv.style.margin = "10px 0";
//         messageDiv.style.border = "1px solid";
//         messageDiv.style.borderRadius = "5px";
//         messageDiv.style.color = type === "error" ? "red" : "green";
//         messageDiv.style.backgroundColor = type === "error" ? "#fdd" : "#dfd";
//         messageDiv.textContent = message;
//     };

//     // Verificar si MetaMask está instalado
//     if (typeof window.ethereum === "undefined") {
//         showMessage("MetaMask no está instalado. Por favor, instálalo para continuar.", "error");
//         return;
//     }

//     // Conectar MetaMask
//     connectWalletBtn.addEventListener("click", async () => {
//         try {
//             const accounts = await ethereum.request({ method: "eth_requestAccounts" });
//             const walletAddress = accounts[0];
//             walletAddressDiv.style.display = "block";
//             walletAddressDiv.textContent = `Wallet Conectada: ${walletAddress}`;
//             dashboard.style.display = "block";
//             showMessage("Wallet conectada exitosamente.");
//         } catch (error) {
//             console.error("Error al conectar MetaMask:", error);
//             showMessage("Error al conectar MetaMask. Por favor, inténtalo de nuevo.", "error");
//         }
//     });

//     // Manejar el envío del formulario de planificación de recorrido
//     routeForm.addEventListener("submit", async (e) => {
//         e.preventDefault();
//         const waypoints = [
//             document.getElementById("waypoint1").value,
//             document.getElementById("waypoint2").value,
//         ];
//         try {
//             const response = await fetch("http://localhost:3000/route", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ waypoints }),
//             });
//             const result = await response.json();
//             if (response.ok) {
//                 showMessage(result.message);
//             } else {
//                 showMessage(result.message, "error");
//             }
//         } catch (error) {
//             console.error("Error al enviar la planificación:", error);
//             showMessage("Error al enviar la planificación de recorrido.", "error");
//         }
//     });

//     // Manejar la subida de fotos
//     uploadForm.addEventListener("submit", async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append("photo", photoInput.files[0]);

//         try {
//             const response = await fetch("http://localhost:3000/upload", {
//                 method: "POST",
//                 body: formData,
//             });
//             const result = await response.json();
//             if (result.fire) {
//                 showMessage(result.message);
//                 // Aquí podrías habilitar un botón para interactuar con la blockchain
//             } else {
//                 showMessage(result.message);
//             }
//         } catch (error) {
//             console.error("Error al subir la foto:", error);
//             showMessage("Error al subir la foto.", "error");
//         }
//     });
// });


// --------VERSION 1
// document.addEventListener("DOMContentLoaded", function () {
//     const connectWalletBtn = document.getElementById("connectWalletBtn");
//     const walletAddressDiv = document.getElementById("walletAddress");
//     const dashboard = document.getElementById("dashboard");

//     let walletAddress = null;

//     // Verifica si MetaMask está instalado
//     if (typeof window.ethereum === "undefined") {
//         alert("MetaMask no está instalado. Por favor, instala MetaMask para continuar.");
//         return;
//     }

//     // Conectar a MetaMask
//     connectWalletBtn.addEventListener("click", async () => {
//         try {
//             // Solicitar acceso a la wallet de MetaMask
//             const accounts = await ethereum.request({ method: "eth_requestAccounts" });
//             walletAddress = accounts[0];
//             walletAddressDiv.innerText = `Conectado: ${walletAddress}`;
//             walletAddressDiv.style.display = "block";
//             dashboard.style.display = "block";  // Mostrar el dashboard
//         } catch (error) {
//             console.error("Error al conectar con MetaMask", error);
//         }
//     });

//     // Función para simular la planificación de recorrido
//     const routeForm = document.getElementById("routeForm");
//     routeForm.addEventListener("submit", (e) => {
//         e.preventDefault();

//         const waypoints = [];
//         // Aquí deberías recoger las coordenadas del formulario (puedes hacer esto dinámicamente)
//         // Por ejemplo, obteniendo los valores de los campos de entrada para los waypoints.
//         // Esto es solo un ejemplo de cómo podrían ser las coordenadas.
//         waypoints.push({ lat: 40.7128, lng: -74.0060 }); // Nueva York
//         waypoints.push({ lat: 34.0522, lng: -118.2437 }); // Los Angeles

//         // Enviar planificación de recorrido al backend
//         fetch("http://localhost:3000/route", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ waypoints }),
//         })
//             .then((response) => response.json())
//             .then((data) => {
//                 console.log("Planificación recibida:", data);
//             })
//             .catch((error) => {
//                 console.error("Error al enviar la planificación:", error);
//             });
//     });

//     // Subir foto
//     const uploadForm = document.getElementById("uploadForm");
//     uploadForm.addEventListener("submit", (e) => {
//         e.preventDefault();

//         const fileInput = document.getElementById("photo");
//         const formData = new FormData();
//         formData.append("photo", fileInput.files[0]);

//         fetch("http://localhost:3000/upload", {
//             method: "POST",
//             body: formData,
//         })
//             .then((response) => response.json())
//             .then((data) => {
//                 console.log(data.message);
//                 if (data.fire) {
//                     alert("¡Fuego detectado en la imagen!");
//                     // Aquí podrías habilitar el botón para registrar la información en la blockchain.
//                 } else {
//                     alert("No se detectó fuego en la imagen.");
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error al subir la foto:", error);
//             });
//     });
// });
