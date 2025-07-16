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
            title: "💥 Top Plataformas de jogos online",
            text: "🔥 Escolha entre as melhores Plataformas para jogar e apostar online com segurança 🔒! \n\n🎁 Bônus imperdíveis \n🎮 Jogos emocionantes \n💳 Saques rápidos \n💰 Comissão diária\n\nAcesse: ",
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

                if (mostrandoTodas) {
                    container.style.transform = `translateX(0px)`;
                    container.style.flexWrap = "wrap";
                    cards.forEach(card => card.style.display = "flex");

                    btnTodas.textContent = "Recolher";
                    btnAnterior.disabled = true;
                    btnProximo.disabled = true;
                } else {
                    container.style.flexWrap = "nowrap";
                    cards.forEach(card => card.style.display = "flex");
                    pagina = 1;
                    exibirPagina(pagina);

                    btnTodas.textContent = "Mostrar Todas";
                    btnAnterior.disabled = false;
                    btnProximo.disabled = false;
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

    function habilitarSwipe(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        let paginaAtual = 1;

        function calcularPorPagina() {
            const largura = window.innerWidth;
            if (largura <= 374) return 1;
            if (largura <= 480) return 2;
            if (largura <= 1023) return 3;
            if (largura <= 1279) return 4;
            return 5;
        }

        const cards = Array.from(container.children);

        function getTotalPaginas() {
            const porPagina = calcularPorPagina();
            return Math.ceil(cards.length / porPagina);
        }

        window.atualizarContadorPorId = function (containerId, pagina) {
            let calcularPorPagina = () => {
                const largura = window.innerWidth;
                if (largura <= 374) return 1;
                if (largura <= 480) return 2;
                if (largura <= 1023) return 3;
                if (largura <= 1279) return 4;
                return 5;
            };

            const container = document.getElementById(containerId);
            const cards = Array.from(container.children);
            const vistos = Math.min(calcularPorPagina() * pagina, cards.length);

            if (containerId === "destaques-container") {
                document.getElementById("quant").textContent = `${vistos}`;
            } else if (containerId === "novas-container") {
                document.getElementById("quant-novas").textContent = `${vistos}`;
            } else if (containerId === "paginacao-container") {
                document.getElementById("quant-restantes").textContent = `${vistos}`;
            }
        };

        function atualizarPagina(delta) {
            const totalPaginas = getTotalPaginas();
            paginaAtual += delta;
            if (paginaAtual < 1) paginaAtual = 1;
            if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

            const larguraCard = cards[0]?.offsetWidth || 0;
            const gap = parseFloat(getComputedStyle(container).gap || "0");
            const porPagina = calcularPorPagina();
            const deslocamento = (larguraCard + gap) * porPagina * (paginaAtual - 1);

            container.style.transform = `translateX(-${deslocamento}px)`;

            // ✅ Atualiza contador corretamente após swipe
            window.atualizarContadorPorId(containerId, paginaAtual);
        }

        container.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        container.addEventListener("touchmove", (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;

            // Evita scroll vertical
            if (Math.abs(diff) > 10) {
                e.preventDefault();
            }
        });

        container.addEventListener("touchend", (e) => {
            if (!isDragging) return;
            const diff = startX - e.changedTouches[0].clientX;
            const limite = 50;

            if (diff > limite) {
                atualizarPagina(1); // próximo
            } else if (diff < -limite) {
                atualizarPagina(-1); // anterior
            }

            isDragging = false;
        });

        // Atualiza ao redimensionar a tela
        window.addEventListener("resize", () => {
            const totalPaginas = getTotalPaginas();
            if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;
            atualizarPagina(0); // manter na mesma página
        });
    }

    habilitarSwipe("destaques-container");
    habilitarSwipe("novas-container");
    habilitarSwipe("paginacao-container");

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

    // Mostrar total de cards por grupo
    function atualizarTotal(containerId, totalId) {
        const container = document.getElementById(containerId);
        const totalDiv = document.querySelector(`#${totalId} .total`);
        if (container && totalDiv) {
            const totalCards = container.querySelectorAll(".card").length;
            totalDiv.textContent = `Total: ${totalCards}`;
        }
    }

    atualizarTotal("destaques-container", "destaques-total");
    atualizarTotal("novas-container", "novas-total");
    atualizarTotal("paginacao-container", "outras-total");

    const totalOriginal = document.getElementById("destaques-total");
    const totalCopia = document.getElementById("destaques-total-destaques");

    if (totalOriginal && totalCopia) {
        totalCopia.textContent = totalOriginal.textContent;
    }

    function atualizarContadorDestaques() {
        const container = document.getElementById("destaques-container");
        const contador = document.getElementById("quant");

        if (!container || !contador) return;

        const cards = Array.from(container.children);

        function calcularPorPagina() {
            const largura = window.innerWidth;
            if (largura <= 374) return 1;
            if (largura <= 480) return 2;
            if (largura <= 1023) return 3;
            if (largura <= 1279) return 4;
            return 5;
        }

        let pagina = 1;
        let totalPaginas = 1;

        function exibirPagina(p) {
            const porPagina = calcularPorPagina();
            totalPaginas = Math.ceil(cards.length / porPagina);
            pagina = p;

            const vistos = Math.min(porPagina * pagina, cards.length);
            contador.textContent = `${vistos}`;
        }

        const btnAnterior = document.getElementById("anterior-destaques");
        const btnProximo = document.getElementById("proximo-destaques");

        if (btnAnterior && btnProximo) {
            btnAnterior.addEventListener("click", () => {
                if (pagina > 1) {
                    pagina--;
                    exibirPagina(pagina);
                }
            });

            btnProximo.addEventListener("click", () => {
                if (pagina < totalPaginas) {
                    pagina++;
                    exibirPagina(pagina);
                }
            });
        }

        window.addEventListener("resize", () => {
            exibirPagina(pagina);
        });

        exibirPagina(pagina);
    }

    function atualizarContadorNovas() {
        const container = document.getElementById("novas-container");
        const contador = document.getElementById("quant-novas");
        const totalDiv = document.getElementById("destaques-total-novas");

        if (!container || !contador || !totalDiv) return;

        const cards = Array.from(container.children);
        totalDiv.textContent = `${cards.length}`;

        function calcularPorPagina() {
            const largura = window.innerWidth;
            if (largura <= 374) return 1;
            if (largura <= 480) return 2;
            if (largura <= 1023) return 3;
            if (largura <= 1279) return 4;
            return 5;
        }

        let pagina = 1;
        let totalPaginas = 1;

        function exibirPagina(p) {
            const porPagina = calcularPorPagina();
            totalPaginas = Math.ceil(cards.length / porPagina);
            pagina = p;

            const vistos = Math.min(porPagina * pagina, cards.length);
            contador.textContent = `${vistos}`;
        }

        const btnAnterior = document.getElementById("anterior-novas");
        const btnProximo = document.getElementById("proximo-novas");

        if (btnAnterior && btnProximo) {
            btnAnterior.addEventListener("click", () => {
                if (pagina > 1) {
                    pagina--;
                    exibirPagina(pagina);
                }
            });

            btnProximo.addEventListener("click", () => {
                if (pagina < totalPaginas) {
                    pagina++;
                    exibirPagina(pagina);
                }
            });
        }

        window.addEventListener("resize", () => {
            exibirPagina(pagina);
        });

        exibirPagina(pagina);
    }

    function atualizarContadorOutras() {
        const container = document.getElementById("paginacao-container");
        const contador = document.getElementById("quant-restantes");
        const totalDiv = document.getElementById("destaques-total-restantes");

        if (!container || !contador || !totalDiv) return;

        const cards = Array.from(container.children);
        totalDiv.textContent = `${cards.length}`;

        function calcularPorPagina() {
            const largura = window.innerWidth;
            if (largura <= 374) return 1;
            if (largura <= 480) return 2;
            if (largura <= 1023) return 3;
            if (largura <= 1279) return 4;
            return 5;
        }

        let pagina = 1;
        let totalPaginas = 1;

        function exibirPagina(p) {
            const porPagina = calcularPorPagina();
            totalPaginas = Math.ceil(cards.length / porPagina);
            pagina = p;

            const vistos = Math.min(porPagina * pagina, cards.length);
            contador.textContent = `${vistos}`;
        }

        const btnAnterior = document.getElementById("anterior");
        const btnProximo = document.getElementById("proximo");

        if (btnAnterior && btnProximo) {
            btnAnterior.addEventListener("click", () => {
                if (pagina > 1) {
                    pagina--;
                    exibirPagina(pagina);
                }
            });

            btnProximo.addEventListener("click", () => {
                if (pagina < totalPaginas) {
                    pagina++;
                    exibirPagina(pagina);
                }
            });
        }

        window.addEventListener("resize", () => {
            exibirPagina(pagina);
        });

        exibirPagina(pagina);
    }

    atualizarContadorDestaques();
    atualizarContadorNovas();
    atualizarContadorOutras();

    // 📋 Botão "Mostrar Todas"
    let mostrandoTodas = false;

    botaoTodos.addEventListener("click", () => {
        mostrandoTodas = !mostrandoTodas;

        if (mostrandoTodas) {
            container.innerHTML = "";

            // Filtrar apenas os cards que NÃO estão nos grupos "destaques" e "novas"
            const cardsNaoAgrupados = cards.filter(card => {
                const grupo = card.getAttribute("data-grupo");
                const estaEmDestaques = grupo === "destaques";
                const estaEmNovas = document.getElementById("novas-container").contains(card);
                return !estaEmDestaques && !estaEmNovas;
            });

            cardsNaoAgrupados.forEach(card => container.appendChild(card));

            anterior.disabled = true;
            proximo.disabled = true;
            botaoTodos.textContent = "Recolher";
            paginaAtual.textContent = `Página 1`;
        } else {
            pagina = 1;
            exibirPagina(pagina);
            botaoTodos.textContent = "Mostrar Todas";
            anterior.disabled = false;
            proximo.disabled = false;
        }
    });

    // ⬆️ Voltar ao topo
    window.addEventListener("scroll", () => {
        botaoTopo.style.display = window.scrollY > 840 ? "flex" : "none";
    });

    botaoTopo.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "auto" });
    });
});