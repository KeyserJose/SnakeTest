function init() {

    for (let i = 0; i < 4; i++) {
        list_of_nodes.push(new node(4 - i, 4, [1, 0]));
    }
    list_of_nodes.push(new node(1, 4, [1, 0])); //duplicate last node for animation cycle

    for (let i = 0; i < 4; i++) {
        list_of_links.push(new link(list_of_nodes[i], list_of_nodes[i + 1]));
    }


    player1 = new player(1, 0);

    document.onkeydown = startGame;

}

function highlightButton(element, direction) {

    console.log(direction);

    if (direction == "left") {
        if (list_of_nodes[0].directionX !== 1) {
            setDirection(-1, 0);
        }
    }

    if (direction == "right") {
        if (list_of_nodes[0].directionX !== -1) {
            setDirection(1, 0);
        }
    }

    if (direction == "down") {
        if (list_of_nodes[0].directionY !== -1) {
            setDirection(0, 1);
        }
    }

    if (direction == "up") {
        if (list_of_nodes[0].directionY !== 1) {
            setDirection(0, -1);
        }
    }



    element.style.backgroundColor = 'var(--grey3)';
    setTimeout(function() { unhighlight(element) }, 100);

}

function unhighlight(element) {

    element.style.backgroundColor = 'var(--grey2)';

}