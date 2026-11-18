
const API_URL = "http://127.0.0.1:8000";

// Load products when page opens
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products/`);
        const products = await response.json();

        const table = document.getElementById("productTable");

        if (!table) return;

        table.innerHTML = "";

        products.forEach(product => {
            const row = document.createElement("tr");

            const idCell = document.createElement("td");
            idCell.textContent = product.id;

            const nameCell = document.createElement("td");
            nameCell.textContent = product.name;

            const priceCell = document.createElement("td");
            priceCell.textContent = "₹" + product.price;

            const stockCell = document.createElement("td");
            stockCell.textContent = product.stock;

            const actionCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.onclick = () => editProduct(product);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.style.background = "#dc3545";
            deleteButton.style.marginLeft = "8px";
            deleteButton.onclick = () => deleteProduct(product.id);

            actionCell.append(editButton, deleteButton);
            row.append(idCell, nameCell, priceCell, stockCell, actionCell);

            table.appendChild(row);
        });

    } catch (error) {
        console.error("Unable to load products:", error);
    }
}


// Add new product
const productForm = document.getElementById("productForm");

if (productForm) {
    productForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const name = document.getElementById("productName").value.trim();
        const price = Number(document.getElementById("productPrice").value);
        const stock = Number(document.getElementById("productStock").value);

        const message = document.getElementById("message");

        try {
            const response = await fetch(`${API_URL}/products/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, price, stock })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.detail || "Unable to add product");
            }

            message.textContent = "Product added successfully!";
            message.style.color = "green";

            productForm.reset();
            loadProducts();

        } catch (error) {
            message.textContent = error.message;
            message.style.color = "red";
        }
    });
}


// Edit product
async function editProduct(product) {
    const name = prompt("Enter product name:", product.name);
    if (name === null) return;

    const priceText = prompt("Enter product price:", product.price);
    if (priceText === null) return;

    const stockText = prompt("Enter stock quantity:", product.stock);
    if (stockText === null) return;

    const price = Number(priceText);
    const stock = Number(stockText);

    if (!name.trim() || !Number.isFinite(price) || price <= 0 ||
        !Number.isInteger(stock) || stock < 0) {
        alert("Please enter valid product details.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products/${product.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name.trim(),
                price,
                stock
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || "Unable to update product");
        }

        alert("Product updated successfully!");
        loadProducts();

    } catch (error) {
        alert(error.message);
    }
}


// Delete product
async function deleteProduct(id) {
    const confirmDelete = confirm("Are you sure you want to delete this product?");

    if (!confirmDelete) return;

    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || "Unable to delete product");
        }

        alert("Product deleted successfully!");
        loadProducts();

    } catch (error) {
        alert(error.message);
    }
}


// Load products on page start
loadProducts();

// Load stock details
async function loadStock() {
    const table = document.getElementById("stockTable");

    if (!table) return;

    try {
        const response = await fetch(`${API_URL}/stock/`);
        const products = await response.json();

        table.innerHTML = "";

        products.forEach(product => {
            const row = document.createElement("tr");

            const values = [
                product.id,
                product.name,
                "₹" + product.price,
                product.stock,
                product.status
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actionCell = document.createElement("td");
            const updateButton = document.createElement("button");

            updateButton.textContent = "Update Stock";

            updateButton.onclick = async function() {
                const quantity = prompt(
                    "Enter new stock quantity:",
                    product.stock
                );

                if (quantity === null) return;

                const newStock = Number(quantity);

                if (!Number.isInteger(newStock) || newStock < 0) {
                    alert("Enter a valid stock quantity.");
                    return;
                }

                try {
                    const updateResponse = await fetch(
                        `${API_URL}/stock/${product.id}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ stock: newStock })
                        }
                    );

                    const result = await updateResponse.json();

                    if (!updateResponse.ok) {
                        throw new Error(result.detail || "Stock update failed");
                    }

                    alert("Stock updated successfully!");
                    loadStock();

                } catch (error) {
                    alert(error.message);
                }
            };

            actionCell.appendChild(updateButton);
            row.appendChild(actionCell);
            table.appendChild(row);
        });

    } catch (error) {
        console.error("Unable to load stock:", error);
    }
}

loadStock();

let selectedProduct = null;

// Display chatbot messages

// Display and save chatbot messages
function addMessage(message, sender) {
    const chatMessages = document.getElementById("chatMessages");

    const messageDiv = document.createElement("div");
    messageDiv.className =
        sender === "user" ? "user-message" : "bot-message";

    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);

    const history = JSON.parse(
        localStorage.getItem("chatHistory") || "[]"
    );

    history.push({
        message: message,
        sender: sender
    });

    localStorage.setItem("chatHistory", JSON.stringify(history));

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// Restore previous chat messages
function restoreChatHistory() {
    const history = JSON.parse(
        localStorage.getItem("chatHistory") || "[]"
    );

    const chatMessages = document.getElementById("chatMessages");

    if (!chatMessages) return;

    history.forEach(item => {
        const messageDiv = document.createElement("div");

        messageDiv.className =
            item.sender === "user" ? "user-message" : "bot-message";

        messageDiv.textContent = item.message;
        chatMessages.appendChild(messageDiv);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

restoreChatHistory();



// Voice response
function speakMessage(message) {
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(message);
        speech.lang = "en-IN";
        speech.rate = 1;

        window.speechSynthesis.speak(speech);
    }
}


// Bot reply
function botReply(message, speak = true) {
    addMessage(message, "bot");

    if (speak) {
        speakMessage(message);
    }
}


// Show available products
async function showProducts() {
    try {
        const response = await fetch(`${API_URL}/products/`);
        const products = await response.json();

        if (!response.ok) {
            throw new Error("Unable to get products");
        }

        const availableProducts = products.filter(p => p.stock > 0);

        if (availableProducts.length === 0) {
            botReply("Sorry, currently no drinks are available.");
            return;
        }

        const productList = availableProducts.map(p =>
            `${p.name} - ₹${p.price} (${p.stock} available)`
        ).join("\n");

        botReply("Here are our available drinks:\n" + productList +
            "\n\nWhich drink would you like to order?");

    } catch (error) {
        botReply("Sorry, unable to load products right now.");
    }
}


// Send customer message
async function sendMessage() {
    const input = document.getElementById("userMessage");

    if (!input) return;

    const message = input.value.trim();

    if (!message) return;

    addMessage(message, "user");
    input.value = "";

    const lowerMessage = message.toLowerCase();

    // Greeting
    if (["hi", "hello", "hey", "start", "menu"].includes(lowerMessage)) {
        selectedProduct = null;

        botReply("Hello! Welcome to our drink ordering system.");
        await showProducts();
        return;
    }

    // Product selection
    if (!selectedProduct) {
        try {
            const response = await fetch(`${API_URL}/products/`);
            const products = await response.json();

            const product = products.find(p =>
                lowerMessage.includes(p.name.toLowerCase())
            );

            if (!product) {
                botReply("Please enter a valid drink name from our menu.");
                await showProducts();
                return;
            }

            if (product.stock <= 0) {
                botReply(`Sorry, ${product.name} is out of stock. Please choose another drink.`);
                return;
            }

            selectedProduct = product;

            botReply(
                `${product.name} price is ₹${product.price}. How many would you like?`
            );

        } catch (error) {
            botReply("Unable to check products. Please try again.");
        }

        return;
    }

    // Quantity selection
    const quantityMatch = lowerMessage.match(/\d+/);

    if (!quantityMatch) {
        botReply("Please enter the quantity as a number.");
        return;
    }

    const quantity = Number(quantityMatch[0]);

    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
        botReply("Please enter a valid quantity.");
        return;
    }

    // Check available stock before placing order
    if (quantity > selectedProduct.stock) {
        botReply(
            `Only ${selectedProduct.stock} ${selectedProduct.name} available. Please enter a quantity between 1 and ${selectedProduct.stock}.`
        );
        return;
    }

    try {
        const response = await fetch(`${API_URL}/orders/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                product_id: selectedProduct.id,
                quantity: quantity
            })
        });

        const result = await response.json();

        if (!response.ok) {
            botReply(result.detail || "Sorry, unable to place your order.");
            return;
        }

        botReply(
            `Order confirmed! ${result.quantity} ${result.product} ordered successfully. Total amount is ₹${result.total_price}. Remaining stock is ${result.remaining_stock}. Thank you!`
        );

        selectedProduct = null;

    } catch (error) {
        botReply("Unable to connect to the ordering system. Please try again.");
    }
}


// Voice input
function startVoiceInput() {
    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    const status = document.getElementById("voiceStatus");

    if (!SpeechRecognition) {
        status.textContent =
            "Voice input is not supported in this browser. Please use Chrome.";
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    status.textContent = "Listening... Please speak.";

    recognition.onresult = function(event) {
        const spokenText = event.results[0][0].transcript;

        document.getElementById("userMessage").value = spokenText;

        status.textContent = "You said: " + spokenText;

        sendMessage();
    };

    recognition.onerror = function() {
        status.textContent =
            "Voice recognition failed. Please try again or type your message.";
    };

    recognition.onend = function() {
        if (status.textContent === "Listening... Please speak.") {
            status.textContent = "Voice input stopped.";
        }
    };

    recognition.start();
}


// Press Enter to send message
const chatInput = document.getElementById("userMessage");

if (chatInput) {
    chatInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
}
