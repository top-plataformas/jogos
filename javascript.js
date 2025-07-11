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
            title: "Top Plataformas 🎰",
            text: "💥 Bônus imperdíveis, 🎮 jogos emocionantes e saques rápidos 💳! Conheça agora as melhores plataformas para apostar com segurança 🔒.",
            url: 'https://top-plataformas.github.io/jogos/'
        }).catch((error) => console.log('Erro ao compartilhar:', error));
    } else {
        alert('Compartilhamento não suportado neste navegador. Copie o link manualmente.');
    }
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

    let mostrandoTodas = false;

    botaoTodos.addEventListener("click", () => {
        mostrandoTodas = !mostrandoTodas;

        if (mostrandoTodas) {
            container.innerHTML = "";
            cards.forEach(card => container.appendChild(card));
            anterior.disabled = true;
            proximo.disabled = true;
            botaoTodos.textContent = "Paginar";
        } else {
            pagina = 1;
            exibirPagina(pagina);
            botaoTodos.textContent = "Todas";
        }
    });

    const botaoTopo = document.getElementById("voltar-topo");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 840) {
            botaoTopo.style.display = "flex";
        } else {
            botaoTopo.style.display = "none";
        }
    });

    botaoTopo.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "auto" });
    });
});