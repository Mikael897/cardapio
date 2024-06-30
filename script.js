const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsConatiner = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCount = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")



let cart = [];

//abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex"
})
//fechar modal
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    } else if(event.target === closeModalBtn){
        cartModal.style.display = "none"
    }
})
menu.addEventListener("click",function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat( parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }
})

// adcionar no carrinho

function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quanty += 1;
        
        
    }else{
        cart.push({
        name,
        price,
        quanty: 1,
    })
    }
    updateCartModal()
}


// atualiza carrinho

function updateCartModal(){
    cartItemsConatiner.innerHTML = ""; // Limpa o conteúdo anterior
    let total = 0; // Inicializa o total

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quanty}</p>
                    <p class="font-medium">R$ ${item.price.toFixed(2)}</p>
                </div>
               
                    <button class="remove-btn" data-name="${item.name}">Remover</button>
                
            </div>
        `;

        total += item.price * item.quanty;
        cartItemsConatiner.appendChild(cartItemElement); // Adiciona o item criado ao container de itens do carrinho
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCount.innerHTML  = cart.length;
}

cartItemsConatiner.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})


function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        if(item.quanty > 1){
            item.quanty -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
} )


checkoutBtn.addEventListener("click", function(){
  const isOpen = checkRestauranteOpen();
    if(!isOpen){
        alert("RESTAURANTE FECHADO NO MOMENTO")
        return;
    }
    if(cart.length === 0) return;
    if( addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("hborder-red-500")
        return;
    }


    const cartItems = cart.map((item)=> {
        return (
            ` ${item.name} Quantidade: (${item.quanty}) Preço: R$ ${item.price} |`
    )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "5551993746229"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})


function checkRestauranteOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}


const spanItem = document.getElementById("date-span")
const isOpen = checkRestauranteOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove( "bg-green-600");
    spanItem.classList.add("bg-red-500")
}

