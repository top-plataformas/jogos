// ================================
// 📌 RASTREAMENTO DE CLIQUES
// ================================
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

// ================================
// 📌 UTILITÁRIOS: COMPARTILHAR E COPIAR LINK
// ================================
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
            title: "💥 Top Plataformas de jogos online",
            text: "🔥 Escolha entre as melhores Plataformas para jogar e apostar online com segurança 🔒!\n\n🎁 Bônus imperdíveis \n🎮 Jogos emocionantes \n💳 Saques rápidos \n💰 Comissão diária\n\nAcesse: ",
            url: 'https://top-plataformas.github.io/jogos/'
        }).catch((error) => console.log('Erro ao compartilhar:', error));
    } else {
        alert('Compartilhamento não suportado neste navegador. Copie o link manualmente.');
    }
}

// ================================
// 🧩 DOMContentLoaded
// ================================
document.addEventListener("DOMContentLoaded", () => {

    // ================================
    // 🔷 SELEÇÃO DE ELEMENTOS
    // ================================
    const cards = Array.from(document.querySelectorAll(".card"));
    const container = document.getElementById("paginacao-container");
    const anterior = document.getElementById("anterior");
    const proximo = document.getElementById("proximo");
    const paginaAtual = document.getElementById("pagina-atual");
    const botaoTodos = document.getElementById("mostrar-todas");
    const botaoTopo = document.getElementById("voltar-topo");

    // ================================
    // 🔷 ORGANIZAÇÃO DE CARDS
    // ================================
    cards.sort((a, b) => {
        const dataA = new Date(a.getAttribute("data-data") || 0);
        const dataB = new Date(b.getAttribute("data-data") || 0);
        return dataB - dataA;
    });
    cards.forEach(card => container.appendChild(card));

    const todosOsCards = document.querySelectorAll("#paginacao-container .card");

    todosOsCards.forEach(card => {
        const grupo = card.getAttribute("data-grupo");
        const dataStr = card.getAttribute("data-data");

        if (grupo === "destaques") {
            document.getElementById("destaques-container").appendChild(card);
            return;
        }

        if (dataStr) {
            const agora = new Date();
            const dataCard = new Date(dataStr);
            const limiteMs = 7 * 24 * 60 * 60 * 1000;

            if (!isNaN(dataCard.getTime()) && (agora - dataCard) <= limiteMs) {
                document.getElementById("novas-container").appendChild(card);
                return;
            }
        }
    });

    // ================================
    // 🔷 FUNÇÃO DE PAGINAÇÃO REUTILIZÁVEL
    // ================================
    function paginarGrupo(config) {
        const {
            containerId,
            btnAnteriorId,
            btnProximoId,
            btnTodasId,
            totalId
        } = config;

        const container = document.getElementById(containerId);
        const btnAnterior = document.getElementById(btnAnteriorId);
        const btnProximo = document.getElementById(btnProximoId);
        const btnTodas = document.getElementById(btnTodasId);
        const totalDiv = document.getElementById(totalId);

        const cards = Array.from(container.children);
        let pagina = 1;
        let mostrandoTodas = false;

        function calcularPorPagina() {
            const largura = window.innerWidth;
            if (largura <= 374) return 1;
            if (largura <= 480) return 2;
            if (largura <= 1023) return 3;
            if (largura <= 1279) return 4;
            return 5;
        }

        function exibirPagina(p) {
            const porPagina = calcularPorPagina();
            const totalPaginas = Math.ceil(cards.length / porPagina);

            // ⛔️ Não aplica transform em telas pequenas (evita conflito com swipe)
            if (window.innerWidth <= 1024) return;

            const larguraCard = cards[0]?.offsetWidth || 0;
            const gap = parseFloat(getComputedStyle(container).gap || "0");
            const deslocamento = (larguraCard + gap) * porPagina * (p - 1);

            container.style.transform = `translateX(-${deslocamento}px)`;

            btnAnterior.disabled = p === 1;
            btnProximo.disabled = p === totalPaginas;
        }

        if (btnAnterior && btnProximo) {
            btnAnterior.addEventListener("click", () => {
                if (pagina > 1) {
                    pagina--;
                    exibirPagina(pagina);
                }
            });

            btnProximo.addEventListener("click", () => {
                const porPagina = calcularPorPagina();
                const totalPaginas = Math.ceil(cards.length / porPagina);
                if (pagina < totalPaginas) {
                    pagina++;
                    exibirPagina(pagina);
                }
            });
        }

        if (btnTodas) {
            btnTodas.addEventListener("click", () => {
                mostrandoTodas = !mostrandoTodas;
                let quantId = "", barraId = "";

                if (containerId === "destaques-container") {
                    quantId = "quant";
                    barraId = "barra-destaques";
                } else if (containerId === "novas-container") {
                    quantId = "quant-novas";
                    barraId = "barra-novas";
                } else if (containerId === "paginacao-container") {
                    quantId = "quant-restantes";
                    barraId = "barra-restantes";
                }

                const quant = document.getElementById(quantId);
                const barra = document.getElementById(barraId);

                if (mostrandoTodas) {
                    if (quant) quant.style.display = "none";
                    if (barra) barra.style.display = "none";
                    container.style.transform = `translateX(0px)`;
                    container.style.flexWrap = "wrap";
                    cards.forEach(card => card.style.display = "flex");
                    btnTodas.textContent = "Recolher";
                    btnAnterior.disabled = true;
                    btnProximo.disabled = true;
                } else {
                    if (quant) quant.style.display = "";
                    if (barra) barra.style.display = "";
                    container.style.flexWrap = "nowrap";
                    cards.forEach(card => card.style.display = "flex");
                    pagina = 1;
                    exibirPagina(pagina);
                    btnTodas.textContent = "Mostrar Todas";
                    const porPagina = calcularPorPagina();
                    const totalPaginas = Math.ceil(cards.length / porPagina);
                    if (btnAnterior) btnAnterior.disabled = pagina === 1;
                    if (btnProximo) btnProximo.disabled = pagina >= totalPaginas;
                }
            });
        }

        if (totalDiv) {
            totalDiv.textContent = `${cards.length}`;
        }

        container.style.flexWrap = "nowrap";
        exibirPagina(pagina);
        window.addEventListener("resize", () => {
            if (!mostrandoTodas) {
                exibirPagina(pagina);
            }
        });
    }

    paginarGrupo({
        containerId: "destaques-container",
        btnAnteriorId: "anterior-destaques",
        btnProximoId: "proximo-destaques",
        btnTodasId: "mostrar-todas-destaques",
        totalId: "destaques-total"
    });

    paginarGrupo({
        containerId: "novas-container",
        btnAnteriorId: "anterior-novas",
        btnProximoId: "proximo-novas",
        btnTodasId: "mostrar-todas-novas",
        totalId: "novas-total"
    });

    paginarGrupo({
        containerId: "paginacao-container",
        btnAnteriorId: "anterior",
        btnProximoId: "proximo",
        btnTodasId: "mostrar-todas",
        totalId: "outras-total"
    });

    // ================================
    // 🔢 CONTADOR DE CARDS – DESTAQUES
    // ================================
    function atualizarContadorDestaques() {
        const container = document.getElementById("destaques-container");
        const contador = document.getElementById("contador-destaques");
        const btnAnterior = document.getElementById("anterior-destaques");
        const btnProximo = document.getElementById("proximo-destaques");
        const btnMostrarTodas = document.getElementById("mostrar-todas-destaques");

        if (!container || !contador || !btnMostrarTodas) return;

        const cards = Array.from(container.children);
        const totalCards = cards.length;
        let pagina = 1;

        function calcularPorPagina() {
            const largura = window.innerWidth;
            if (largura <= 374) return 1;
            if (largura <= 480) return 2;
            if (largura <= 1023) return 3;
            if (largura <= 1279) return 4;
            return 5;
        }

        function atualizarTextoContador() {
            const mostrandoTodas = btnMostrarTodas.textContent === "Recolher";
            if (mostrandoTodas) {
                contador.innerHTML = `<span class="total">${totalCards}</span> Plataformas 🎮`;
            } else {
                const porPagina = calcularPorPagina();
                const vistos = Math.min(pagina * porPagina, totalCards);
                contador.innerHTML = `<span class="total">${vistos}</span> / <span class="total">${totalCards}</span> Plataformas 🎮`;
            }
        }

        function exibirPagina(p) {
            pagina = p;
            atualizarTextoContador();
        }

        // Clique em Anterior
        if (btnAnterior) {
            btnAnterior.addEventListener("click", () => {
                if (pagina > 1) {
                    pagina--;
                    exibirPagina(pagina);
                }
            });
        }

        // Clique em Próximo
        if (btnProximo) {
            btnProximo.addEventListener("click", () => {
                const porPagina = calcularPorPagina();
                const totalPaginas = Math.ceil(totalCards / porPagina);
                if (pagina < totalPaginas) {
                    pagina++;
                    exibirPagina(pagina);
                }
            });
        }

        // Clique em Mostrar Todas / Recolher
        btnMostrarTodas.addEventListener("click", () => {
            setTimeout(() => {
                const mostrandoTodas = btnMostrarTodas.textContent === "Recolher";

                if (!mostrandoTodas) {
                    pagina = 1; // ← volta para página inicial ao "Recolher"
                }

                atualizarTextoContador();
            }, 0); // espera o texto do botão mudar
        });

        // Atualiza ao redimensionar
        window.addEventListener("resize", () => {
            atualizarTextoContador();
        });

        // Inicializa
        exibirPagina(pagina);
    }

    atualizarContadorDestaques();

    // =============================
    // 🔢 CONTADOR DE CARDS – NOVAS
    // =============================
    function atualizarContadorNovas() {
        const container = document.getElementById("novas-container");
        const contador = document.getElementById("contador-novas");
        const btnAnterior = document.getElementById("anterior-novas");
        const btnProximo = document.getElementById("proximo-novas");
        const btnMostrarTodas = document.getElementById("mostrar-todas-novas");

        if (!container || !contador || !btnMostrarTodas) return;

        const cards = Array.from(container.children);
        const totalCards = cards.length;
        let pagina = 1;

        function calcularPorPagina() {
            const largura = window.innerWidth;
            if (largura <= 374) return 1;
            if (largura <= 480) return 2;
            if (largura <= 1023) return 3;
            if (largura <= 1279) return 4;
            return 5;
        }

        function atualizarTextoContador() {
            const mostrandoTodas = btnMostrarTodas.textContent === "Recolher";
            if (mostrandoTodas) {
                contador.innerHTML = `<span class="total">${totalCards}</span> Plataformas 🎮`;
            } else {
                const porPagina = calcularPorPagina();
                const vistos = Math.min(pagina * porPagina, totalCards);
                contador.innerHTML = `<span class="total">${vistos}</span> / <span class="total">${totalCards}</span> Plataformas 🎮`;
            }
        }

        function exibirPagina(p) {
            pagina = p;
            atualizarTextoContador();
        }

        if (btnAnterior) {
            btnAnterior.addEventListener("click", () => {
                if (pagina > 1) {
                    pagina--;
                    exibirPagina(pagina);
                }
            });
        }

        if (btnProximo) {
            btnProximo.addEventListener("click", () => {
                const porPagina = calcularPorPagina();
                const totalPaginas = Math.ceil(totalCards / porPagina);
                if (pagina < totalPaginas) {
                    pagina++;
                    exibirPagina(pagina);
                }
            });
        }

        btnMostrarTodas.addEventListener("click", () => {
            setTimeout(() => {
                const mostrandoTodas = btnMostrarTodas.textContent === "Recolher";
                if (!mostrandoTodas) {
                    pagina = 1;
                }
                atualizarTextoContador();
            }, 0);
        });

        window.addEventListener("resize", () => {
            atualizarTextoContador();
        });

        exibirPagina(pagina);
    }

    atualizarContadorNovas();

    // ================================
    // 🔢 CONTADOR DE CARDS – RESTANTES
    // ================================
    function atualizarContadorOutras() {
        const container = document.getElementById("paginacao-container");
        const contador = document.getElementById("contador-restantes");
        const btnAnterior = document.getElementById("anterior");
        const btnProximo = document.getElementById("proximo");
        const btnMostrarTodas = document.getElementById("mostrar-todas");

        if (!container || !contador || !btnMostrarTodas) return;

        const cards = Array.from(container.children);
        const totalCards = cards.length;
        let pagina = 1;

        function calcularPorPagina() {
            const largura = window.innerWidth;
            if (largura <= 374) return 1;
            if (largura <= 480) return 2;
            if (largura <= 1023) return 3;
            if (largura <= 1279) return 4;
            return 5;
        }

        function atualizarTextoContador() {
            const mostrandoTodas = btnMostrarTodas.textContent === "Recolher";
            if (mostrandoTodas) {
                contador.innerHTML = `<span class="total">${totalCards}</span> Plataformas 🎮`;
            } else {
                const porPagina = calcularPorPagina();
                const vistos = Math.min(pagina * porPagina, totalCards);
                contador.innerHTML = `<span class="total">${vistos}</span> / <span class="total">${totalCards}</span> Plataformas 🎮`;
            }
        }

        function exibirPagina(p) {
            pagina = p;
            atualizarTextoContador();
        }

        if (btnAnterior) {
            btnAnterior.addEventListener("click", () => {
                if (pagina > 1) {
                    pagina--;
                    exibirPagina(pagina);
                }
            });
        }

        if (btnProximo) {
            btnProximo.addEventListener("click", () => {
                const porPagina = calcularPorPagina();
                const totalPaginas = Math.ceil(totalCards / porPagina);
                if (pagina < totalPaginas) {
                    pagina++;
                    exibirPagina(pagina);
                }
            });
        }

        btnMostrarTodas.addEventListener("click", () => {
            setTimeout(() => {
                const mostrandoTodas = btnMostrarTodas.textContent === "Recolher";
                if (!mostrandoTodas) {
                    pagina = 1;
                }
                atualizarTextoContador();
            }, 0);
        });

        window.addEventListener("resize", () => {
            atualizarTextoContador();
        });

        exibirPagina(pagina);
    }

    atualizarContadorOutras();

    // ================================
    // 🔷 BOTÃO VOLTAR AO TOPO
    // ================================
    window.addEventListener("scroll", () => {
        botaoTopo.style.display = window.scrollY > 840 ? "flex" : "none";
    });

    botaoTopo.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "auto" });
    });

    // ================================
    // 🔷 PESQUISA POR NOME
    // ================================
    const campoPesquisa = document.getElementById("pesquisa");
    const secaoPrincipal = document.getElementById("todas-as-plataformas");
    const secaoResultados = document.getElementById("resultado-pesquisa");
    const containerFiltrados = document.getElementById("cards-filtrados");
    const todosCards = Array.from(document.querySelectorAll(".card"));

    campoPesquisa.addEventListener("input", () => {
        const termo = campoPesquisa.value.trim().toLowerCase();
        containerFiltrados.innerHTML = "";

        if (!termo) {
            secaoResultados.style.display = "none";
            secaoPrincipal.style.display = "";
            todosCards.forEach(card => {
                const grupo = card.getAttribute("data-grupo");
                const dataStr = card.getAttribute("data-data");

                if (grupo === "destaques") {
                    document.getElementById("destaques-container").appendChild(card);
                } else if (dataStr) {
                    const agora = new Date();
                    const dataCard = new Date(dataStr);
                    const diffMs = agora - dataCard;
                    const limiteMs = 7 * 24 * 60 * 60 * 1000;

                    if (!isNaN(dataCard.getTime()) && diffMs <= limiteMs) {
                        document.getElementById("novas-container").appendChild(card);
                    } else {
                        document.getElementById("paginacao-container").appendChild(card);
                    }
                } else {
                    document.getElementById("paginacao-container").appendChild(card);
                }
            });
            return;
        }

        const filtrados = todosCards.filter(card => {
            const nomePlataforma = card.querySelector("span")?.textContent.toLowerCase();
            return nomePlataforma && nomePlataforma.includes(termo);
        });

        if (filtrados.length > 0) {
            filtrados.forEach(card => containerFiltrados.appendChild(card));
            secaoPrincipal.style.display = "none";
            secaoResultados.style.display = "flex";
        } else {
            secaoPrincipal.style.display = "none";
            secaoResultados.style.display = "flex";
            containerFiltrados.innerHTML = `<div class="mensagem-nenhum-resultado"><p>Nenhum resultado encontrado.</p></div>`;
        }
    });
});