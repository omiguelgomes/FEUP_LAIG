//Handles all game events (process turns, moves, ect)
//see powerpoint on moodle for more info
class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        //game objects or aides
        this.undocube = new MyUnitCubeQuad(this.scene);
        this.resetcube = new MyUnitCubeQuad(this.scene);
        this.moviecube = new MyUnitCubeQuad(this.scene);
        this.obj1 = new MyUnitCubeQuad(this.scene);
        this.board = new MyBoard(this.scene);

        //game variables
        this.pieces = [];
        this.squares = [];
        this.selSquare = [];
        this.cells = [];
        this.score = [0, 0];
        this.player = 1;
	    this.gameScene = [];
	    this.count = 0;
        this.framecount = -1;
        this.enviro = 0;

        //pieces positions must be alternated
	    this.position = [1, 3, 5, 7,
				    8, 10, 12, 14,
				    17, 19, 21, 23,
				    40, 42, 44, 46,
				    49, 51, 53,	55,
                    56, 58, 60, 62];

        this.moveTime = 1;
        this.points = [0,0,0,
                    14,0,14];
        
        //TODO: deal with animations
        //this.move = new LinearAnimation(this.scene, this.points, this.moveTime * 7);
        
        //creates a quad (tile) for every cell of the board (8x8)
        for (let i = 0; i < 64; i++) {
            this.cells[i] = new MyTile(this.scene);
            this.squares[i] = 0;
        }

        //creates all 24 pieces and defines to whose player they belong to
        for (let j = 0; j < 24; j++){
            this.pieces[j] = new MyPiece(this.scene);
            this.squares[this.position[j]] =  j <= 11 ? 1 : -1;
        }

        this.gameScene[0] = [];
	    for (i = 0; i<24; i++){
            this.gameScene[0].push(this.position[i]);
        }

        //textures and materials for the several objects
        this.boxAappearance = new CGFappearance(this.scene);
        this.boxAappearance.setAmbient(0.4, 0.2, 0.1, 0.5);
        this.boxAappearance.setSpecular(0.1, 0.1, 0.1, 0.1);
        this.boxAappearance.setDiffuse(0.8, 0.8, 0.8, 1);
        this.boxAappearance.setShininess(5);
        this.boxAappearance.loadTexture("img/blackglass.png");

        this.boxBappearance = new CGFappearance(this.scene);
        this.boxBappearance.setAmbient(0.4, 0.2, 0.1, 0.5);
        this.boxBappearance.setSpecular(0.1, 0.1, 0.1, 0.1);
        this.boxBappearance.setDiffuse(0.8, 0.8, 0.8, 1);
        this.boxBappearance.setShininess(5);
        this.boxBappearance.loadTexture("img/glass.png");

        this.selAppearance = new CGFappearance(this.scene);
        this.selAppearance.setAmbient(0.4, 0.2, 0.1, 0.5);
        this.selAppearance.setSpecular(0.1, 0.1, 0.1, 0.1);
        this.selAppearance.setDiffuse(0.8, 0.8, 0.8, 1);
        this.selAppearance.setShininess(5);
        this.selAppearance.loadTexture("img/green.png");

        this.pieceAppearance = new CGFappearance(this.scene);
        this.pieceAppearance.setAmbient(1, 1, 1, 1);
        this.pieceAppearance.setSpecular(1, 1, 1, 1);
        this.pieceAppearance.setDiffuse(0, 0, 0, 1);
        this.pieceAppearance.setShininess(5);

        this.selpieceAppearance = new CGFappearance(this.scene);
        this.selpieceAppearance.setAmbient(1, 1, 1, 1);
        this.selpieceAppearance.setSpecular(1, 1, 1, 1);
        this.selpieceAppearance.setDiffuse(1, 0.3, 0, 1);
        this.selpieceAppearance.setShininess(5);

        this.undoAppearance = new CGFappearance(this.scene);
        this.undoAppearance.setAmbient(0.4, 0.2, 0.1, 0.5);
        this.undoAppearance.setSpecular(0.1, 0.1, 0.1, 0.1);
        this.undoAppearance.setDiffuse(0.8, 0.8, 0.8, 1);
        this.undoAppearance.setShininess(5);
        this.undoAppearance.loadTexture("img/undo.png");

        this.movieAppearance = new CGFappearance(this.scene);
        this.movieAppearance.setAmbient(0.4, 0.2, 0.1, 0.5);
        this.movieAppearance.setSpecular(0.1, 0.1, 0.1, 0.1);
        this.movieAppearance.setDiffuse(0.8, 0.8, 0.8, 1);
        this.movieAppearance.setShininess(5);
        this.movieAppearance.loadTexture("img/movie.png");

        this.resetAppearance = new CGFappearance(this.scene);
        this.resetAppearance.setAmbient(0.4, 0.2, 0.1, 0.5);
        this.resetAppearance.setSpecular(0.1, 0.1, 0.1, 0.1);
        this.resetAppearance.setDiffuse(0.8, 0.8, 0.8, 1);
        this.resetAppearance.setShininess(5);
        this.resetAppearance.loadTexture("img/reset.png");

    }

    update(t) {

        this.move.update(t);
    }

    display() {
        this.scene.translate(7.5, 3.7, 7.5);
        this.scene.pushMatrix();
        this.scene.translate(-3.5, 0.01, -3.5);

        if (this.scene.customId == 150)
            this.undomode(4);
        else if (this.scene.customId == 200)
            this.moviemode(5);
        else if (this.scene.customId == 250)
            this.resetgame();
        else if (this.scene.customId == 300)
            this.envirotoggle();
        else if (this.scene.customId < 100)
            this.pickedsquare(2);
        else if (this.scene.customId > 100)
            this.pickedcylinder(1);
        else
            this.defaultdisp(3);

        this.scene.popMatrix();

    }

    drawSquares(mode)
    {
        for (let i = 0; i < this.cells.length; i++) {
            this.scene.pushMatrix();

            this.scene.translate(i % 8, 0, Math.floor(i / 8));

            this.scene.registerForPick(100, this);

            if (this.selSquare[i] && mode == 1) {
                this.selAppearance.apply();
                this.scene.registerForPick(i, this.cells[i]);
            }
            else if (Math.floor(i / 8) % 2 ^ i % 2 == 0)
                this.boxAappearance.apply();
            else
                this.boxBappearance.apply();

            this.scene.rotate(Math.PI / 2, 1, 0, 0);
            this.cells[i].display();
            this.scene.popMatrix();
            if (mode == 5)
                this.scene.customId = 200;
        }
    }

    drawPieces(mode)
    {
        var kickcount = [-1,-1];
        var zshift;
        
        for (i = 0; i < this.pieces.length; i++) {
            this.scene.pushMatrix();

            if (mode == 1 && i == (this.savePick - 101))
				this.selpieceAppearance.apply();
			else if (i >= 12)
                this.pieceAppearance.apply();
                
            if (this.position[i] != -1)
                this.scene.translate(this.position[i] % 8, 0, Math.floor(this.position[i] / 8));
            
            if ((this.player == 1 && i < 12) || (this.player == -1 && i >= 12) && this.position[i] != -1)
                this.scene.registerForPick(i + 1 + 100, this.pieces[i]);
            else
                this.scene.registerForPick(100, this);

            if (this.position[i] == -1) {
                this.scene.translate(9, 0, 4);
                zshift = i >= 12 ? 1 : 0;
                kickcount[zshift]++;
                this.scene.translate(kickcount[zshift] % 2, Math.floor(kickcount[zshift] / 2) * 0.4, -1 * zshift);
                this.scene.rotate(Math.PI / 2, 1, 0, 0);
                this.scene.scale(0.4, 0.4, 0.4, 1);
                this.pieces[i].display();
            }
            else if (i == (this.savePick - 101) && mode == 2) {

				this.move.apply(this.player, this.left);
				this.scene.rotate(Math.PI/2, 1,0,0);
				this.scene.scale(0.4,0.4,0.4,1);
				this.pieces[i].display();
            }
            else {
				this.scene.rotate(Math.PI/2, 1,0,0);
				this.scene.scale(0.4,0.4,0.4,1);
				this.pieces[i].display();
            }
            
            this.scene.popMatrix();

        }

        if (mode != 2)
		    this.scene.registerForPick(100, this);
    }

    drawObjects()
    {
        this.scene.pushMatrix();
		this.scene.translate(9.5,0,1);
		
		if (this.count > 0){
			this.scene.registerForPick(150, this.undocube);
			this.undoAppearance.apply();
			this.undocube.display();
        }
        
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
		this.scene.translate(-2,0,1);
		
		if (this.count > 0){
			this.scene.registerForPick(250, this.resetcube);
			this.resetAppearance.apply();
			this.resetcube.display();
		}
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(9.5, 0, 6);
        this.scene.registerForPick(200, this.moviecube);
        this.movieAppearance.apply();
        this.moviecube.display();

        this.scene.registerForPick(100, this);
        this.scene.popMatrix();
    }

    drawBoard()
    {
        this.board.display();
    }

    moviemode(mode)
    {
        if (this.framecount == this.count) {
            this.scene.customId = 100;
            this.framecount = -1;
            this.defaultdisp(3);
        }
        else {
            this.framecount++;
            this.frame1 = new Date();
            this.frame2 = new Date();

            while (this.frame2 - this.frame1 < 500) {
                this.change = new Date();
                this.frame2 = this.change;
            }

            for (let j = 0; j < 24; j++) {
                this.position[j] = this.gameScene[this.framecount][j];
            }

            this.defaultdisp(mode);
        }
    }

    undomode(mode)
    {
        for (let i = 0; i < 64; i++)
            this.squares[i] = 0;

        for (let i = 0; i < 24; i++) {
            this.position[i] = this.gameScene[this.count - 1][i];
            this.squares[this.position[i]] = i <= 11 ? 1 : -1;
        }

        this.count--;
        this.defaultdisp(mode);
        this.playerswap();
        this.scene.customId = 100;
    }

    pickedcylinder(mode)
    {
        this.savePick = this.scene.customId;

        //desselect all cells
        for (let i = 0; i<64; i++)
            this.selSquare[i] = 0;
            
        var pos = this.position[this.savePick - 101];
        
        if (this.squares[pos + 7*this.player] == 0 && (Math.floor(pos/8) - Math.floor((pos + 7*this.player)/8)) == -1*this.player)
            this.selSquare[pos + 7*this.player] = 1;
            
	    if (this.squares[pos + 9*this.player] == 0 && (Math.floor(pos/8) - Math.floor((pos + 9*this.player)/8)) == -1*this.player)
            this.selSquare[pos + 9*this.player] = 1;
            
	    if (this.squares[pos + 7*this.player] == -1*this.player && (this.squares[pos + 14*this.player] == 0) && (Math.floor(pos/8) - Math.floor((pos + 14*this.player)/8)) == -2*this.player)
            this.selSquare[pos + 14*this.player] = 1;
            
	    if (this.squares[pos + 9*this.player] == -1*this.player && (this.squares[pos + 18*this.player] == 0) && (Math.floor(pos/8) - Math.floor((pos + 18*this.player)/8)) == -2*this.player)
            this.selSquare[pos + 18*this.player] = 1;
            
        this.defaultdisp(mode);

        this.init = new Date();
        //this.move = new LinearAnimation(this.scene, this.points, this.moveTime * 10);
    }

    pickedsquare(mode)
    {
        this.savePick2 = this.scene.customId;
        var pos = this.position[this.savePick - 101];
        
        if (this.savePick2 - pos == 9 || this.savePick2 - pos == -9 
            || this.savePick2 - pos == 18 || this.savePick2 - pos == -18)
            this.left = 1;
        else
            this.left = -1;

        this.defaultdisp(mode);

        var time = new Date();
        var timepermove = this.moveTime * (Math.abs(Math.floor(this.savePick2/8) - Math.floor(pos/8))) * 800;
        
        if (time - this.init >= timepermove) {
            this.position[this.savePick - 101] = this.savePick2;
            this.squares[this.savePick2] = this.squares[pos];
            this.squares[pos] = 0;

            //Jumping elimination
            if (Math.abs(Math.floor(this.savePick2 / 8) - Math.floor(pos / 8)) == 2) {
                for (i = 0; i < 24; i++)
                    if (this.position[i] == pos + (this.savePick2 - pos) / 2) {
                        this.squares[this.position[i]] = 0;
                        this.position[i] = -1;
                    }
            }

            this.gameScene[++this.count] = [];
            for (i = 0; i < 24; i++) 
            {
                this.gameScene[this.count].push(this.position[i]);
                
                if (i >= 12 && this.position[i] < 8 && this.position[i]!= -1){
                    alert("Black wins!!");
                    this.score[0]++;
                    this.resetgame();
                }
                else if (i<12 && this.position[i]>55){
                    alert("White wins!!");
                    this.score[1]++;
                    this.resetgame();
                }
            }

            this.scene.customId = 100;
		    this.playerswap();
        }
    }

    resetgame()
    {
        while(this.count)
		this.undomode(4);
    }

    playerswap()
    {
        this.player *= -1;
		if(this.player == 1)
			this.scene.camera.setPosition(vec3.fromValues(7, 16, -13));
		else
			this.scene.camera.setPosition(vec3.fromValues(7, 16, 30));
    }

    defaultdisp(mode)
    {
        this.drawSquares(mode);
	    this.drawPieces(mode);
	    this.drawObjects();
        this.drawBoard();
    }

    envirotoggle()
    {
        this.enviro = (this.enviro + 1) % 2;
	    this.defaultdisp(3);
	    this.scene.customId = 100;
    }

}