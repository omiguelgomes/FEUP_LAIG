//Handles all game events (process turns, moves, ect)
//see powerpoint on moodle for more info
class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.gameSequence = new MyGameSequence(this.scene);
        this.animator = new MyAnimator(this.scene);

        //TODO: replace xml game boards with single instance of orchestrator (duh!...)
        this.gameboard = new MyBoard(this.scene, 0);
        this.enemyGameBoard = new MyBoard(this.scene, 200);

        this.turn = 0;
        this.move = [];
        this.pause = false;
        this.pieces = [];
    }

    checkPicking() {
        if (this.scene.pickMode == false) {
            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
                for (let i = 0; i < this.scene.pickResults.length; i++) {
                    let obj = this.scene.pickResults[i][0];
                    if (obj) {
                        let customId = this.scene.pickResults[i][1];

                        if (costumId < 200) {
                            var row = customId % 10;
                            var col = Math.floor(customId / 10);
                        } else {
                            var row = (customId - 200) % 10;
                            var col = Math.floor((customId - 200) / 10);
                        }
                        this.changeMove([row, col]);
                        this.pause = true;
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }

    update(t) {

        this.animator.update(t);
    }

    display() {
        this.gameboard.display();
        this.enemyGameBoard.display();

        for (let i = 0; i < this.pieces.length; i++) {
            this.pieces[i].display();
        }

    }

    //TODO: miguel, do your magic here 

    createAnimation(turn, move) {
        let animation = new MyKeyFrameAnimation(this.scene, 5);

        //TODO: actual animation handler here (see moodle for more)
        this.animator.addAnimation(animation);
    }

    changeMove(move) {
        this.scene.setPickEnabled(false);

        this.move = move;
        this.move.push(this.turn);
        this.gameSequence.addMove(move);

        setTimeout(() => {
            this.turn = Math.abs(this.turn - 1);
            this.scene.setPickEnabled(true);
        }, 5000);

        this.createAnimation(this.turn, this.move);
    }
}