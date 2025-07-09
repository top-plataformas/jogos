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

function toggleRedes() {
    const redes = document.getElementById("redes-sociais");
    redes.classList.toggle("ativo");
    redes.style.display = redes.style.display === "flex" ? "none" : "flex";
}

document.addEventListener("DOMContentLoaded", () => {
    const cards = Array.from(document.querySelectorAll(".card"));
    const container = document.getElementById("paginacao-container");
    const anterior = document.getElementById("anterior");
    const proximo = document.getElementById("proximo");
    const paginaAtual = document.getElementById("pagina-atual");

    // ✅ Atualiza o total de plataformas
    const totalElement = document.querySelector(".total-plataformas .total");
    if (totalElement) {
        totalElement.textContent = cards.length;
        totalElement.textContent = `Total: ${cards.length}`;
    }

    const porPagina = 10;
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

    exibirPagina(pagina);

    const botaoTodos = document.getElementById("mostrar-todas");
    const navegacao = document.querySelector(".container-navegacao");

    let mostrandoTodos = false;

    botaoTodos.addEventListener("click", () => {
        mostrandoTodos = !mostrandoTodos;

        if (mostrandoTodos) {
            container.innerHTML = "";
            cards.forEach(card => container.appendChild(card));
            paginaAtual.textContent = "Mostrar Todas";
            anterior.disabled = true;
            proximo.disabled = true;
            botaoTodos.textContent = "Paginar";
            navegacao.style.display = "none"; // 👉 esconde a navegação
        } else {
            pagina = 1;
            exibirPagina(pagina);
            botaoTodos.textContent = "Mostrar Todas";
            navegacao.style.display = ""; // 👉 mostra novamente (volta ao padrão)
        }
    });

    // Botão de Voltar ao Topo
    const botaoTopo = document.createElement("button");
    botaoTopo.id = "voltar-topo";
    botaoTopo.innerHTML = '<i class="fas fa-arrow-up"></i>';
    botaoTopo.setAttribute("aria-label", "Voltar ao topo");
    document.body.appendChild(botaoTopo);

    window.addEventListener("scroll", () => {
        botaoTopo.style.display = window.scrollY > 300 ? "flex" : "none";
    });

    botaoTopo.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});