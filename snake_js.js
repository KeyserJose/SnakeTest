let unit_width = 5;
const snake_width = 4;
let list_of_nodes = [];
let list_of_links = [];
let player1;
let snake_time = 250;
let game_over = false;


function startGame(e) {

    document.onkeydown = keyPushed;

    startAnimationCycle();

}

function startAnimationCycle() {

    //change direction of first node (helps for when it becomes the tail)
    let first_node = list_of_nodes[0];
    first_node.directionX = player1.directionX;
    first_node.directionY = player1.directionY;

    //create next node and add to top of snake
    let new_node = new node(first_node.x + first_node.directionX, first_node.y + first_node.directionY, [first_node.directionX, first_node.directionY]);
    let new_link = new link(new_node, first_node);
    let crash = checkForCollision(new_node);    //boolean to check if head will hit snake

    list_of_nodes.unshift(new_node);
    list_of_links.unshift(new_link);

    //adjust animations if there will be a crash
    new_node.animate(crash);
    new_link.grow(crash);

    //delete last node
    deleteTail();
    moveTail(crash);

    if (!crash) {

        setTimeout(function () { startAnimationCycle() }, snake_time);

    }

}

function checkForCollision(nodeA) {

    if (nodeA.x > 9 || nodeA.x < 0 || nodeA.y > 9 || nodeA.y < 0) {

        return true

    }

    let nodeA_idx = nodeA.x + 10 * nodeA.y;

    for (let i = 0; i < list_of_nodes.length; i++) {

        let nodeB_idx = list_of_nodes[i].x + 10 * list_of_nodes[i].y;
        if (nodeA_idx === nodeB_idx) {

            return true

        }

    }

    return false

}

function deleteTail() {

    let last_node = list_of_nodes.pop();
    last_node.element.remove();

    let last_link = list_of_links.pop();
    if (last_link.element) {
        last_link.element.remove();
    }

}

function moveTail(crash) {

    last_node = list_of_nodes[list_of_nodes.length - 1];
    last_node.goToNextPosition();
    last_node.animate(crash);

    last_link = list_of_links[list_of_links.length - 1];
    last_link.shrink(crash);

}

function keyPushed(e) {

    if (e.keyCode == "65") {
        if (list_of_nodes[0].directionX !== 1) {
            setDirection(-1, 0);
        }
    }

    if (e.keyCode == "68") {
        if (list_of_nodes[0].directionX !== -1) {
            setDirection(1, 0);
        }
    }

    if (e.keyCode == "83") {
        if (list_of_nodes[0].directionY !== -1) {
            setDirection(0, 1);
        }
    }

    if (e.keyCode == "87") {
        if (list_of_nodes[0].directionY !== 1) {
            setDirection(0, -1);
        }
    }
}

function setDirection(xdir, ydir) {

    player1.directionX = xdir;
    player1.directionY = ydir;

}


class player {

    constructor(x, y) {
        this.directionX = x;
        this.directionY = y;
    }

}

class node {
    constructor(x, y, direction) {

        this.x = x;
        this.y = y;
        this.element = createNewNodeElement(this.x, this.y);
        this.directionX = direction[0];
        this.directionY = direction[1];

    }

    goToNextPosition() {

        this.x += this.directionX;
        this.y += this.directionY;
        this.element.style.left = (5 * this.x).toString() + "vh";
        this.element.style.top = (5 * this.y).toString() + "vh";

    }

    animate(crash) {

        if (this.directionX !== 0) {
            this.moveHorizontal(crash);
        } else {
            this.moveVertical(crash);
        }

    }

    moveHorizontal(crash) {

        if (crash) { 

            this.element.animate([
                { transform: 'translateX(calc(-5 * ' + (this.directionX).toString() + 'vh))' },
                { transform: 'translateX(calc(-4 * ' + (this.directionX).toString() + 'vh))' },
            ], {
                duration: snake_time * 0.2,
                fill: "forwards",
            });

        } else {

            this.element.animate([
                { transform: 'translateX(calc(-5 * ' + (this.directionX).toString() + 'vh))' },
                { transform: 'translateX(0vh)' },
            ], {
                duration: snake_time,
                fill: "forwards",
            });

        }

    }

    moveVertical(crash) {

        if (crash) {

            this.element.animate([
                { transform: 'translateY(calc(-5 * ' + (this.directionY).toString() + 'vh))' },
                { transform: 'translateY(calc(-4 * ' + (this.directionY).toString() + 'vh))' },
            ], {
                duration: snake_time * 0.2,
                fill: "forwards",
            });

        } else {

            this.element.animate([
                { transform: 'translateY(calc(-5 * ' + (this.directionY).toString() + 'vh))' },
                { transform: 'translateY(0vh)' },
            ], {
                duration: snake_time,
                fill: "forwards",
            });

        }

    }

}

class link {

    constructor(nodeA, nodeB) {
        this.x = Math.min(nodeA.x, nodeB.x);
        this.y = Math.min(nodeA.y, nodeB.y);
        this.directionX = nodeA.directionX;
        this.directionY = nodeA.directionY;
        this.element = createNewLinkElement();

        if (nodeA.directionX === 0) {

            this.element.style.height = unit_width.toString() + "vh";
            this.element.style.width = snake_width.toString() + "vh";
            this.element.style.left = (unit_width * this.x + 0.5).toString() + "vh";
            this.element.style.top = (unit_width * (this.y + 0.5)).toString() + "vh";

        } else {

            this.element.style.height = snake_width.toString() + "vh";
            this.element.style.width = unit_width.toString() + "vh";
            this.element.style.left = (unit_width * (this.x + 0.5)).toString() + "vh";
            this.element.style.top = (unit_width * this.y + 0.5).toString() + "vh";

        }

        if (nodeA.directionX === 1) {
            this.element.style.transformOrigin = "left";
        }

        if (nodeA.directionX === -1) {
            this.element.style.transformOrigin = "right";
        }

        if (nodeA.directionY === 1) {
            this.element.style.transformOrigin = "top";
        }

        if (nodeA.directionY === -1) {
            this.element.style.transformOrigin = "bottom";
        }

    }

    grow(crash) {
        
        if (crash) { 

            this.element.animate([
                { transform: 'scaleX(' + (1 - Math.abs(this.directionX)).toString() + ') scaleY(' + (1 - Math.abs(this.directionY)).toString() + ')' },
                { transform: 'scaleX(' + (1 - 0.8 * Math.abs(this.directionX)).toString() + ') scaleY(' + (1 - 0.8 * Math.abs(this.directionY)).toString() + ')' },
            ], {
                duration: snake_time * 0.2,
                fill: "forwards",
            });

        } else {

            this.element.animate([
                { transform: 'scaleX(' + (1 - Math.abs(this.directionX)).toString() + ') scaleY(' + (1 - Math.abs(this.directionY)).toString() + ')' },
                { transform: 'scaleX(1) scaleY(1)' },
            ], {
                duration: snake_time,
                fill: "forwards",
            });

        }

    }

    shrink(crash) {

        let opposites = {
            "center top": "center bottom",
            "center bottom": "center top",
            "left center": "right center",
            "right center": "left center"
        };

        this.element.style.transformOrigin = opposites[this.element.style.transformOrigin];

        if (crash) { 

            this.element.animate([
                { transform: 'scaleX(1) scaleY(1)' },
                { transform: 'scaleX(' + (1 - 0.2 * Math.abs(this.directionX)).toString() + ') scaleY(' + (1 - 0.2 * Math.abs(this.directionY)).toString() + ')' },
            ], {
                duration: snake_time * 0.2,
                fill: "forwards",
            });

        } else {

            this.element.animate([
                { transform: 'scaleX(1) scaleY(1)' },
                { transform: 'scaleX(' + (1 - Math.abs(this.directionX)).toString() + ') scaleY(' + (1 - Math.abs(this.directionY)).toString() + ')' },
            ], {
                duration: snake_time,
                fill: "forwards",
            });

        }

    }

}

function createNewNodeElement(x, y) {

    let new_node = document.createElement("div");
    new_node.className = "node";
    new_node.style.left = (unit_width * x).toString() + "vh";
    new_node.style.top = (unit_width * y).toString() + "vh";
    document.getElementById("snake-container").appendChild(new_node);

    return new_node

}

function createNewLinkElement() {

    let new_link = document.createElement("div");
    new_link.className = "link";
    document.getElementById("snake-container").appendChild(new_link);

    return new_link

}