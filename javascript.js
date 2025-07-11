document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (e) {
        const botao = e.target.closest("button, a");
        if (botao) {
            const texto = botao.getAttribute("data-label")?.trim()
                || botao.textContent?.trim()
                || botao.id
                || botao.className
                || botao.href
                || "botao_desconhecido";

            gtag("event", "clique_botao", {
                event_category: "interacao",
                event_label: texto
            });
        }
    });
});

/*function toggleRedes() {
    const redes = document.getElementById("redes-sociais");
    redes.classList.toggle("ativo");
    redes.style.display = redes.style.display === "flex" ? "none" : "flex";
}*/

function copiarLink() {
    const url = "https://top-plataformas.github.io/jogos/";
    navigator.clipboard.writeText(url).then(() => {
        const span = document.querySelector(".copiar");
        span.textContent = "Link Copiado";
        span.style.color = "#128f06";

        setTimeout(() => {
            span.textContent = "Copiar Link";
            span.style.color = "";
        }, 5000);
    });
}

function compartilharSite() {
    if (navigator.share) {
        navigator.share({
            title: "💥 Top Plataformas para 🎮 Jogar e Apostar 💸 Online",
            text: "💥 Bônus imperdíveis, 🎮 jogos emocionantes e saques rápidos 💳! Conheça agora as melhores plataformas para apostar com segurança 🔒.",
            url: 'https://top-plataformas.github.io/jogos/'
        }).catch((error) => console.log('Erro ao compartilhar:', error));
    } else {
        alert('Compartilhamento não suportado neste navegador. Copie o link manualmente.');
    }
}

document.addEventListener("DOMContentLoaded", () => {

    // 📦 Seleção de elementos
    const cards = Array.from(document.querySelectorAll(".card"));
    const container = document.getElementById("paginacao-container");
    const anterior = document.getElementById("anterior");
    const proximo = document.getElementById("proximo");
    const paginaAtual = document.getElementById("pagina-atual");
    const totalElement = document.querySelector(".total-plataformas .total");
    const botaoTodos = document.getElementById("mostrar-todas");
    const botaoTopo = document.getElementById("voltar-topo");

    // Ordem dos cards por data
    cards.sort((a, b) => {
        const dataA = new Date(a.getAttribute("data-data") || 0);
        const dataB = new Date(b.getAttribute("data-data") || 0);
        return dataB - dataA; // mais recentes primeiro
    });

    cards.forEach(card => container.appendChild(card));
    

    // 🔄 Mover os cards para os containers certos
    const todosOsCards = document.querySelectorAll("#paginacao-container .card");

    todosOsCards.forEach(card => {
        const grupo = card.getAttribute("data-grupo");
        const dataStr = card.getAttribute("data-data");

        // Cards fixos no grupo "destaques"
        if (grupo === "destaques") {
            document.getElementById("destaques-container").appendChild(card);
            return;
        }

        // Cards considerados "novos" pela data
        if (dataStr) {
            const agora = new Date();
            const dataCard = new Date(dataStr);
            const diffMs = agora - dataCard;
            const limiteMs = 7 * 24 * 60 * 60 * 1000; // 7 dias

            if (!isNaN(dataCard.getTime()) && diffMs <= limiteMs) {
                document.getElementById("novas-container").appendChild(card);
                return;
            }
        }
    });


    // 🔢 Paginação
    /*const porPagina = 10;
    let pagina = 1;
    const totalPaginas = Math.ceil(cards.length / porPagina);

    function exibirPagina(p) {
        container.innerHTML = "";
        const inicio = (p - 1) * porPagina;
        const fim = p * porPagina;
        cards.slice(inicio, fim).forEach(card => container.appendChild(card));
        paginaAtual.textContent = `Página ${p}/${totalPaginas}`;
        anterior.disabled = p === 1;
        proximo.disabled = p === totalPaginas;
    }

    exibirPagina(pagina);*/

    // ⏮ Botões de navegação
    anterior.addEventListener("click", () => {
        if (pagina > 1) {
            pagina--;
            exibirPagina(pagina);
        }
    });

    proximo.addEventListener("click", () => {
        if (pagina < totalPaginas) {
            pagina++;
            exibirPagina(pagina);
        }
    });

    // ✅ Exibe total de plataformas
    if (totalElement) {
        totalElement.textContent = `Total: ${cards.length}`;
    }

    // 📋 Botão "Mostrar Todas"
    /*let mostrandoTodas = false;

    botaoTodos.addEventListener("click", () => {
        mostrandoTodas = !mostrandoTodas;

        if (mostrandoTodas) {
            container.innerHTML = "";
            cards.forEach(card => container.appendChild(card));
            anterior.disabled = true;
            proximo.disabled = true;
            botaoTodos.textContent = "Paginar";
            paginaAtual.textContent = `Página 1/${totalPaginas}`;
        } else {
            pagina = 1;
            exibirPagina(pagina);
            botaoTodos.textContent = "Todas";
        }
    });*/

    // ⬆️ Voltar ao topo
    window.addEventListener("scroll", () => {
        botaoTopo.style.display = window.scrollY > 840 ? "flex" : "none";
    });

    botaoTopo.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "auto" });
    });

});