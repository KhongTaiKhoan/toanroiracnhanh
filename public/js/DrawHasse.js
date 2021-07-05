class Node_ {
    static X = 80;
    static Y = 80;
    static radius = 12;
    constructor(row, col,id) {
        this.col = col;
        this.row = row;
        this.id = id;
    }

    getID(){return this.id;}
    getX(){
        return (this.col*Node_.X)+Node_.radius+10;
    }
    getY(){
        return (this.row * Node_.Y)+Node_.radius+10;
    }
}


class DrawObj{
    constructor(id){
        $(id).append('<canvas height="400px"></canvas>');
        this.canvas = document.getElementsByTagName('canvas')[0];
        this.context = this.canvas.getContext('2d'); 
        this.fontSize = 15;
        this.context.font = `${this.fontSize}px Arial`;
        this.context.lineWidth = .5;
    }

    drawNode(node) {
        // this.context.beginPath();
        this.context.arc(node.getX(),node.getY(),Node_.radius,0,2*Math.PI,true);
        this.context.stroke();
        // this.context.closePath();
        this.context.beginPath();
        this.context.fillText(node.id, node.getX()-this.fontSize/2+4,node.getY()+this.fontSize/2-2);
        // this.context.closePath();


    }

    drawEdge(node1,node2) {
        let pos1, pos2;
        if (node1.getY() === node2.getY()) {

            if (node1.getX() < node2.getX()) {
                pos1 = [node1.getX() + Node_.radius, node1.getY()];
                pos2 = [node2.getX() - Node_.radius, node2.getY()];
            } else {
                pos1 = [node1.getX() - Node_.radius, node1.getY()];
                pos2 = [node2.getX() + Node_.radius, node2.getY()];
            }
        } else {
            if (node1.getY() < node2.getY()) {
                pos1 = [node1.getX(), node1.getY() +  Node_.radius];
                pos2 = [node2.getX(), node2.getY() -  Node_.radius];
            } else {
                pos1 = [node1.getX(), node1.getY() -  Node_.radius];
                pos2 = [node2.getX(), node2.getY() +  Node_.radius];
            }
        }
        
        this.context.beginPath();        // Khai báo vẽ đường thẳng mới
        this.context.moveTo(pos1[0], pos1[1]);     // Điểm bắt đầu
        this.context.lineTo(pos2[0], pos2[1]);   // Điểm kết thúc
        this.context.stroke();           // Tiến hành vẽ
    }
}


