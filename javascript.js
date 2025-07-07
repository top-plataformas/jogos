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

    const botaoTodos = document.getElementById("mostrar-todos");
    let mostrandoTodos = false;

    botaoTodos.addEventListener("click", () => {
        mostrandoTodos = !mostrandoTodos;

        if (mostrandoTodos) {
            container.innerHTML = "";
            cards.forEach(card => container.appendChild(card));
            paginaAtual.textContent = "Mostrar Todos";
            anterior.disabled = true;
            proximo.disabled = true;
            botaoTodos.textContent = "Paginar";
        } else {
            pagina = 1;
            exibirPagina(pagina);
            botaoTodos.textContent = "Mostrar Todos";
        }
    });
});