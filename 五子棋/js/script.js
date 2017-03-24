//定义棋盘位置数组，黑白子回合，游戏是否继续
var chessBoard = [];
var me =true;
var over=false;

//赢法数组
var wins = [];

//统计数组，人的，和计算机的
var myWin =[];
var computerWin =[];

//初始化棋盘位置各个点的数据为0
for(var i=0; i<15;i++){
	chessBoard[i]=[];
	for(var j=0; j<15; j++){
		chessBoard[i][j]=0;
	}
}

//让赢法数组变成一个三维数组
for(var i=0;i<15;i++){
	wins[i]=[];
	for(var j=0;j<15;j++){
		wins[i][j]=[];
	}	
}

var count = 0;
//竖线赢法数组
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i][j+k][count]=true;
		}
		count++;
	}
}
//横线赢法数组
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[j+k][i][count]=true;
		}
		count++;
	}
}
//斜线赢法数组
for(var i=0;i<11;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j+k][count]=true;
		}
		count++;
	}
}

//反斜线赢法数组
for(var i=0;i<11;i++){
	for(var j=14;j>3;j--){
		for(var k=0;k<5;k++){
			wins[i+k][j-k][count]=true;
		}
		count++;
	}
}

console.log(count);

/*
 * 人和计算机一共各自有count个统计数组元素。
 * 让计算机和人类的统计数组都初始化为0
 */
for(var i=0; i<count;i++){
	myWin[i]=0;
	computerWin[i]=0;
}

//拿到棋盘以及棋盘的2d绘画界面
var chess = document.getElementById('chess');
var context = chess.getContext('2d');
//拿到背景
var logo = new Image();
logo.src = "img/top_bg.jpg";

//页面运行后加载背景图片和棋盘
logo.onload = function(){
	 
	context.drawImage(logo, 0, 0, 450, 450);	
	drawChessBoard();

	
}

//定义棋盘画法
var drawChessBoard = function(){
for(var i=0; i<15; i++){
	context.moveTo(15+i*30, 15);
	context.lineTo(15+i*30, 435);
	context.stroke();
	context.moveTo(15, 15+i*30);
	context.lineTo(435, 15+i*30);
	context.stroke();
	}	
}

//定义落子的function。参数是x和y的定位，以及黑、白子类型
var oneStep = function(i,j,me){
	context.beginPath();
	context.arc(15+i*30,15+j*30,13,0,2*Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(14+i*30,15+j*30,11,13+i*30,15+j*30,1);
	if(me){
	gradient.addColorStop(0,"#0A0A0A");
	gradient.addColorStop(1,"#636766");
	}else{
	gradient.addColorStop(0,"#D1D1D1");
	gradient.addColorStop(1,"#F9F9F9");	
	}
	context.fillStyle=gradient;
	context.fill();
}

//设置点击事件
chess.onclick = function(e){
	//游戏结束则返回
	if(over){
		return;
	}
	//如果是计算机回合则返回
	if(!me){
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x/30);
	var j = Math.floor(y/30);
	//之前没有落过子就可以下
	if(chessBoard[i][j]==0){
		oneStep(i,j,me);
		chessBoard[i][j]=1;
		//下子后让人类统计数组中和这个位置有关的元素都加一
		for(var k=0;k<count;k++){
			if(wins[i][j][k]){
				myWin[k]++;
				//和这个位置有关的计算机统计数组元素就设为6，表示不可能成功了
				computerWin[k]=6;
				//k元素集齐全部五个即为获胜
				if(myWin[k]==5){
					window.alert('you win');
					over = true;
				}
			}
		}
		//交换下子权利，汇到计算机回合
		if(!over){
			me = !me;
			computerAI();
		}
	}	

}

//定义计算机回合
var computerAI = function(){
	//initial每个点对应的人类和计算机的分值
	var myScore =[];
	var computerScore =[];
	//initial之后用于储存最大分值的变量，和最大分值位置的变量u，v
	var max =0;
	var u=0, v=0;
	//让分值几何定义为三维数组
	for(var i=0;i<15;i++){
		myScore[i]=[];
		computerScore[i]=[];
		for(var j=0;j<15;j++){
			myScore[i][j]=0;
			computerScore[i][j]=0;
		}
	}
	//定义每个点分值的计算
	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			if(chessBoard[i][j]==0){
				//历遍所有的赢法
				for(var k=0; k<count; k++){
					//如果k赢法的五个子包括位置i，j
					//那么根据在此赢法中以及实现了的落子数量来定义分值
					if(wins[i][j][k]){
						if(myWin[k]==1){
							myScore[i][j] += 20;
						}else if(myWin[k]==2){
							myScore[i][j] += 800;
						}else if(myWin[k]==3){
							myScore[i][j] += 2000;
						}else if(myWin[k]==4){
							myScore[i][j] += 10000;
						}
						//定义电脑在该赢法上此点的分值
						if(computerWin[k]==1){
							computerScore[i][j] += 21;
						}else if(computerWin[k]==2){
							computerScore[i][j] += 400;
						}else if(computerWin[k]==3){
							computerScore[i][j] += 2200;
						}else if(computerWin[k]==4){
							computerScore[i][j] += 20000;
						}
					}//end of wins ijk if statement
				}//end of for loop of every k
				
				//让两个分值相加得出最高分值的位置
				if(computerScore[i][j]+myScore[i][j]>max){
					max = computerScore[i][j]+myScore[i][j];
					u=i;
					v=j;
				}
				
				/*另一种算法
				if(myScore[i][j]>max){
					max = myScore[i][j];
					u=i;
					v=j;
				}else if(myScore[i][j]==max){
					if(computerScore[i][j]>computerScore[u][v]){
						u=i;
						v=j;
					}
				}
				if(computerScore[i][j]>max){
					max = computerScore[i][j];
					u=i;
					v=j;
				}else if(computerScore[i][j]==max){
					if(myScore[i][j]>myScore[u][v]){
						u=i;
						v=j;
					}
				}*/
			
			
			}//end of if chessBoard
		}//end of j for loop
	}//end of i for loop
	
	//在最优地点落子
	oneStep(u,v,false);
	//定义棋盘该位置为白子（白子写2，黑子写1）
	chessBoard[u][v]=2;
	//更新和这个点相关的电脑赢法统计数据
	for(var k=0;k<count;k++){
			if(wins[u][v][k]){
				computerWin[k]++;
				myWin[k]=6;
				if(computerWin[k]==5){
					window.alert('PC win');
					over = true;
				}
			}
		}
		if(!over){
			me = !me;
		}
}
