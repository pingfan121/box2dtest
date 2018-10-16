class Food
{
    constructor(img)
    {
        var fixDef = new b2FixtureDef;
        fixDef.density = .5;
        fixDef.friction = 0.4;
        fixDef.restitution = 0.8;
      

       let vs=main.getVertices("1001");

       let temppoints=new Array();


        
       vs.forEach(element => {
                element.forEach(item => {
                        if(haveItem(temppoints,item)==false)
                        {
                                temppoints.push(item);
                        }
                });
                
        });


        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.Set(width/2,height/2);

        let body = world.CreateBody(bodyDef)

        vs.forEach(item => {
            
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsVector(item,item.length);
            body.CreateFixture(fixDef);

            item.forEach(element => 
                {
                    if(haveItem(temppoints,element)==false)
                    {
                            temppoints.push(element);
                    }
            });
        });

        //顺时针排序
        arrangeClockwise(temppoints);

        this.body=body;

        body.userdata=this;
        body.update=this.update.bind(this);

        this.img=img;
        this.ww=159;
        this.hh=142;

        body.centerpoint=new b2Vec2(0,0);
        body.lastangle=0;

    }

    update(ctx,body)
    {

        for( let fix=body.GetFixtureList();fix != null;fix=fix.GetNext())
        {
            let shape=fix.GetShape();

            let arr =shape.GetVertices();
    
            let angle=body.GetAngle();
    
             let position =body.GetPosition();
    
             let xx = position.x;
             let yy = position.y ;
    
             let xxxx=body.centerpoint.x* drawScale;
             let yyyy=body.centerpoint.y* drawScale;
    
             let lastangle=body.lastangle;
    
             let temppoint2=body.GetWorldPoint(body.centerpoint);
    
             
             ctx.save();
             /*原点偏移*/
             ctx.translate(xx* drawScale, yy * drawScale);
             /*旋转 (弧度)*/
             ctx.rotate(angle);
             ctx.beginPath();
    
             var startX = arr[0].x * drawScale;
             var startY = arr[0].y* drawScale;
             ctx.moveTo(startX, startY);
     
             for(var i = 1; i <arr.length; i++) {
                 var newX = arr[i].x* drawScale;
                 var newY = arr[i].y* drawScale;
                 ctx.lineTo(newX, newY);
             }
             
             ctx.closePath();
             ctx.rotate(-angle);
            // ctx.fill();
             ctx.translate(-xx* drawScale, -yy * drawScale);
             //ctx.restore();
    
    
             //-------------------------------------
    
             //ctx.save();
              ctx.clip();
              /*原点偏移*/
              ctx.translate(temppoint2.x* drawScale, temppoint2.y * drawScale);
              /*旋转 (弧度)*/
              ctx.rotate(lastangle+angle);
              ctx.drawImage(this.img, -this.ww/2, -this.hh/2, this.ww, this.hh);
              ctx.rotate(-lastangle-angle);
              ctx.translate(-temppoint2.x* drawScale, -temppoint2.y * drawScale);
              ctx.restore();
        }

    }

    // drawCircle(origin,color)
    //  {

    //     let temp =ctx.fillStyle;

    //    ctx.fillStyle =color;
    //    // canvas.graphics.drawCircle(origin.x*worldScale,origin.y*worldScale,5);

    //     ctx.beginPath();
    //     ctx.arc(origin.x*drawScale,origin.y*drawScale,5,0,2*Math.PI);
    //     ctx.stroke();

    //     ctx.fillStyle =temp;
    // };
}