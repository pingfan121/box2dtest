
let mouseX,mouseY,isMouseDown,mouseJoint,mousePVec,selectedBody;

let laserSegment=null;

let affectedByLaser=new Array();
let affectedByLaser2=new Array();
let entryPoint=new Array();

let selectbody=null;

class MouseEvent2
{
    constructor()
    {
        canvas.addEventListener("mousedown", this.mouseDown.bind(this), true);
        canvas.addEventListener("mouseup", this.mouseUp.bind(this), true);
        canvas.addEventListener("mousemove", this.mouseMove.bind(this), true);
    }

     mouseDown(e){
        mouseX = e.offsetX / drawScale;
        mouseY = e.offsetY / drawScale;
        
        isMouseDown = true;

        laserSegment=new b2Segment();
        laserSegment.p1=new b2Vec2(mouseX,mouseY);
    };
    mouseMove(e){
        mouseX = e.offsetX / drawScale;
        mouseY = e.offsetY / drawScale;
         
        if(isMouseDown==true)
        {
            laserSegment.p2=new b2Vec2(mouseX,mouseY);

            console.log("1111");
        }
        
    };
    mouseUp(e)
    {
        isMouseDown=false;

        mouseX = e.offsetX / drawScale;
        mouseY = e.offsetY / drawScale;

        laserSegment.p2=new b2Vec2(mouseX,mouseY);

        affectedByLaser.length=0;
        affectedByLaser2.length=0;
        entryPoint.length=0;

        selectbody=null;

        world.RayCast(this.laserFired2.bind(this),laserSegment.p1,laserSegment.p2);
        world.RayCast(this.laserFired3.bind(this),laserSegment.p2,laserSegment.p1);

        this.laserFired4();
    };

    update()
    {

       if (laserSegment!=null && laserSegment.p1 !=null && laserSegment.p2!=null )
        {
            ctx.beginPath();
            ctx.moveTo(laserSegment.p1.x*drawScale,laserSegment.p1.y*drawScale);
            ctx.lineTo(laserSegment.p2.x*drawScale,laserSegment.p2.y*drawScale);
            ctx.stroke();

        }
    };

    laserFired2(fixture,point,normal,fraction)
    {
       let affectedBody=fixture.GetBody();

       if (selectbody==null)
        {
               selectbody=affectedBody;
               affectedByLaser.push(fixture);
               entryPoint.push(point);
       }
       else if(affectedBody == selectbody)
       {
        affectedByLaser.push(fixture);
        entryPoint.push(point);
       }

       return 1;
    }

    laserFired3(fixture,point,normal,fraction)
    {
       let affectedBody=fixture.GetBody();
      

       if (selectbody==null)
       {
            return 0;
       }
       else if(affectedBody == selectbody)
       {
        let fixtureIndex=affectedByLaser.indexOf(fixture);

        if(fixtureIndex!=-1)
        {
                let object=new Object();

                object.fixture=fixture;

                object.startpoint=entryPoint[fixtureIndex];
                object.endpoint=point;

                affectedByLaser2.push(object);
        }
       }

       return 1;
    }

    laserFired4()
     {

        console.log("怎么回事111");
        if(selectbody==null)
        {
                return;
        }

        console.log("怎么回事222");
        
        let affectedBody=selectbody;

        let new1=new Array();
        let new2=new Array();


        //没有被切割的纹理
        let fixarr=new Array();


        for( let fix=selectbody.GetFixtureList();fix != null;fix=fix.GetNext())
        {
                let flag=false;

                affectedByLaser2.forEach(data => {
                        if(data.fixture==fix)
                        {  
                                flag=true;
                                return false;
                        }
                });

                if(flag==false)
                {
                        fixarr.push(fix);
                }
        }


        






        affectedByLaser2.forEach(data => {
                
                let affectedPolygon=data.fixture.GetShape();

                let point=data.endpoint;
                let entryPoint=data.startpoint;
        
             
                let rayCenter=new b2Vec2((point.x+entryPoint.x)/2,(point.y+entryPoint.y)/2);
                let rayAngle=Math.atan2(entryPoint.y-point.y,entryPoint.x-point.x);
                let polyVertices=affectedPolygon.GetVertices();
                let newPolyVertices1=new Array();
                let newPolyVertices2=new Array();
                let currentPoly=0;
                let cutPlaced1=false;
                let cutPlaced2=false;

                for (let i=0; i<polyVertices.length; i++) {
                        let worldPoint=affectedBody.GetWorldPoint(polyVertices[i]);
                        let cutAngle=Math.atan2(worldPoint.y-rayCenter.y,worldPoint.x-rayCenter.x)-rayAngle;
                        if (cutAngle<Math.PI*-1) {
                                cutAngle+=2*Math.PI;
                        }
                        if (cutAngle>0&&cutAngle<=Math.PI) {
                                if (currentPoly==2) {
                                        cutPlaced1=true;
                                        newPolyVertices1.push(point);
                                        newPolyVertices1.push(entryPoint);
                                }
                                newPolyVertices1.push(worldPoint);
                                currentPoly=1;
                        } else {
                                if (currentPoly==1) {
                                        cutPlaced2=true;
                                        newPolyVertices2.push(entryPoint);
                                        newPolyVertices2.push(point);
                                }
                                newPolyVertices2.push(worldPoint);
                                currentPoly=2;

                        }
                }
                if (! cutPlaced1) {
                        newPolyVertices1.push(point);
                        newPolyVertices1.push(entryPoint);
                }
                if (! cutPlaced2) {
                        newPolyVertices2.push(entryPoint);
                        newPolyVertices2.push(point);
                }

                new1.push(newPolyVertices1);
                new2.push(newPolyVertices2);

        });

        //找出没有被切割的纹理
        //------------------------------

        // let i=0;
        // while(i<fixarr.length)
        // {
        //         let ps1=fixarr[i].GetShape().GetVertices();

        //         for(let k=0;k<ps1.length;k++)
        //         {
        //            let worldPoint=affectedBody.GetWorldPoint(ps1[k]);
   
        //            if(this.haveItem2(new1,worldPoint)==true && this.haveItem2(new2,worldPoint)==false)
        //            {
        //                    let worlds=new Array();
   
        //                    ps1.forEach(element => {
        //                            let worldPoint=affectedBody.GetWorldPoint(ps1[k]);
        //                            worlds.push(worldPoint);
        //                    });
   
        //                    new1.push(worlds);
        //                    fixarr.splice(i, 1); 
        //                    i=0;
        //                    break;
        //            }
        //            else if(this.haveItem2(new2,worldPoint)==true && this.haveItem2(new1,worldPoint)==false)
        //            {
        //                    let worlds=new Array();
   
        //                    ps1.forEach(element => {
        //                            let worldPoint=affectedBody.GetWorldPoint(ps1[k]);
        //                            worlds.push(worldPoint);
        //                    });
        //                    new2.push(worlds);
        //                    fixarr.splice(i, 1); 
        //                    i=0;
        //                    break;
        //            }
        //            else
        //            {
        //                    i++;
        //            }
        //         }
        // }

        this.tttt(fixarr,new1,new2,affectedBody);

        //-------------------------------


        this.createSlice2(new1,affectedBody);
        this.createSlice2(new2,affectedBody);
        world.DestroyBody(affectedBody);
    };


    tttt(fixarr,new1,new2,affectedBody)
    {
        for(let i=0;i<fixarr.length;i++)
        {
                let ps1=fixarr[i].GetShape().GetVertices();

                let flag=false;

                for(let k=0;k<ps1.length;k++)
                {
                   let worldPoint=affectedBody.GetWorldPoint(ps1[k]);
   
                   if(this.haveItem2(new1,worldPoint)==true && this.haveItem2(new2,worldPoint)==false)
                   {
                           let worlds=new Array();
   
                           ps1.forEach(element => {
                                   let worldPoint=affectedBody.GetWorldPoint(element);
                                   worlds.push(worldPoint);
                           });
   
                           new1.push(worlds);
                           fixarr.splice(i, 1); 
                           flag=true;
                           break;
                   }
                   else if(this.haveItem2(new2,worldPoint)==true && this.haveItem2(new1,worldPoint)==false)
                   {
                           let worlds=new Array();
   
                           ps1.forEach(element => {
                                   let worldPoint=affectedBody.GetWorldPoint(element);
                                   worlds.push(worldPoint);
                           });
                           new2.push(worlds);
                           fixarr.splice(i, 1); 
                           flag=true;
                           break;
                   }
                }

                if(flag==true)
                {
                   this.tttt(fixarr,new1,new2,affectedBody);
                   return ;
                }
        }
    }

    drawCircle(origin)
     {
       // canvas.graphics.lineStyle(2,color);
       // canvas.graphics.drawCircle(origin.x*worldScale,origin.y*worldScale,5);

        ctx.beginPath();
        ctx.arc(origin.x*drawScale,origin.y*drawScale,5,0,2*Math.PI);
        ctx.stroke();
    };

    createSlice2(fixtures,oldbody)
     {
        let fix= oldbody.GetFixtureList();

        var sliceFixture = new b2FixtureDef();
        sliceFixture.density= fix.GetDensity();
        sliceFixture.friction= fix.GetFriction();
        sliceFixture.restitution=fix.GetRestitution();

        var sliceBody= new b2BodyDef();
     //   sliceBody.position.Set(centre.x, centre.y);
        sliceBody.type=b2Body.b2_dynamicBody;


        let worldSlice=world.CreateBody(sliceBody);





        //找到中心点

        let temppoints=new Array();

        fixtures.forEach(element => {
               
                element.forEach(item => {
                        if(this.haveItem(temppoints,item)==false)
                        {
                                temppoints.push(item);
                        }
                });
                
        });

        //顺时针排序
        this.arrangeClockwise(temppoints);

        let centre=this.findCentroid(temppoints,temppoints.length);

        worldSlice.SetPosition(centre);

        fixtures.forEach(item => {
                

                let vertices=item;
                let numVertices=item.length;

                for (let i=0; i<numVertices; i++) {
                        vertices[i].Subtract(centre);
                }
              
                let slicePoly = new b2PolygonShape();
                slicePoly.SetAsVector(vertices,numVertices);
                sliceFixture.shape=slicePoly;
                worldSlice.CreateFixture(sliceFixture);

                for (i=0; i<numVertices; i++) {
                        vertices[i].Add(centre);
                }
        });

      
       
       

        if(oldbody.update!=null)
        {
                worldSlice.update=oldbody.update;
                worldSlice.centerpoint=worldSlice.GetLocalPoint(oldbody.GetWorldPoint(oldbody.centerpoint));

                worldSlice.lastangle=oldbody.GetAngle()+oldbody.lastangle;
        }
       
    }

    findCentroid(vs, count) 
    {
        var c = new b2Vec2();
        var area=0.0;
        var p1X=0.0;
        var p1Y=0.0;
        var inv3=1.0/3.0;
        for (var i = 0; i < count; ++i) {
                var p2=vs[i];
                var p3=i+1<count?vs[i+1]:vs[0];
                var e1X=p2.x-p1X;
                var e1Y=p2.y-p1Y;
                var e2X=p3.x-p1X;
                var e2Y=p3.y-p1Y;
                var D = (e1X * e2Y - e1Y * e2X);
                var triangleArea=0.5*D;
                area+=triangleArea;
                c.x += triangleArea * inv3 * (p1X + p2.x + p3.x);
                c.y += triangleArea * inv3 * (p1Y + p2.y + p3.y);
        }
        c.x*=1.0/area;
        c.y*=1.0/area;
        return c;
    }

    getlastcenter(p1,p2)
    {

        // let a =180/Math.PI * angle;

        // let x0= (p1.x - p2.x)*Math.cos(a) - (p1.y - p2.y)*Math.sin(a) + p2.x ;

        // let y0= (p1.x - p2.x)*Math.sin(a) + (p1.y - p2.y)*Math.cos(a) + p2.y ;
        
        // return new b2Vec2(x0,y0);

    let x=Math.abs(p1.x-p2.x);
    let y=Math.abs(p1.y-p2.y);
    let z=Math.sqrt(x*x+y*y);
      return Math.asin(y/z)
    }



    haveItem(arr, point) {
        let flag = false;

        arr.forEach(element => {

            if (element.x == point.x && element.y == point.y) {
                flag = true;
                return false;
            }
        });

        return flag;
    }

    //判断点在不在二位数组里面
    haveItem2(arrarr, point) 
    {
        let flag = false;

        arrarr.forEach(item => {

                item.forEach(element => {
                        if (element.x == point.x && element.y == point.y) {
                                flag = true;
                                return false;
                            }
                });

                if(flag==true)
                {
                        return flag;  
                }
        });

        return flag;
    }

    arrangeClockwise(vec) {
        // 算法很简单
        // 首先，将所有的 points 安装它们的 x 坐标由小到大排列
        // 其次，用最左边和最右边的两个点(即 C 点和 D 点)创建一个 tempVec，用来存储重新排
        // 序后的顶点
        // 再次，声明每一个顶点，利用前面提过的 det()方法，从 CD 上方的顶点开始添加每个顶内容来源： 9RIA.com 天地会-译林军 内容编辑： Pilihou
        // 点，随后添加 CD 下方的顶点
        // 就这些!
        var n = vec.length, d, i1 = 1, i2 = n - 1;

        var tempVec = new Array(n), C, D;
        vec.sort(this.comp1);
        tempVec[0] = vec[0];
        C = vec[0];
        D = vec[n - 1];
        for (i = 1; i < n - 1; i++) {
            d = this.det(C.x, C.y, D.x, D.y, vec[i].x, vec[i].y);
            if (d < 0) {
                tempVec[i1++] = vec[i];
            } else {
                tempVec[i2--] = vec[i];
            }
        }
        tempVec[i1] = vec[n - 1];
        return tempVec;
    }

    comp1(a, b) {
        //这个是 arrangeClockwise()方法里用到的一个比较函数——它可以很快的判断两个 point 的
        // x 坐标的大小
        if (a.x > b.x) {
            return 1;
        } else if (a.x < b.x) {
            return -1;
        }
        return 0;
    }
    det(x1, y1, x2, y2, x3, y3)
     {
        // 这个方法用来返回 3x3 矩阵的行列式值
        // 如果你学过矩阵，你肯定知道如果三个给定的点顺时针排列则返回正值，如果逆时针排
        //列则返回负值，如果三点在一条线，则返回 0
        // 另外一个有用的知识点，行列式值的绝对值是这个三个点组成的三角形面积的两倍
        return x1*y2+x2*y3+x3*y1-y1*x2-y2*x3-y3*x1;
    }


    //判断一个纹理上的点是不是在其他纹理上面
    isinFixture(fix1,fixarr)
    {
        //得到纹理上的点



        
    }




   
}