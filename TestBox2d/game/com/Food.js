class Food
{
    constructor()
    {
        var fixDef = new b2FixtureDef;
        fixDef.density = .5;
        fixDef.friction = 0.4;
        fixDef.restitution = 0.8;
        fixDef.shape = new b2PolygonShape;

       // fixDef.shape.SetAsBox(160/2/drawScale, 143/2/drawScale);

       let vs=main.getVertices("1001");

    //  vs.length=0;
    //  vs.push(new b2Vec2(-159/2/drawScale,-142/2/drawScale));
    //  vs.push(new b2Vec2(159/2/drawScale,-142/2/drawScale));
    //  vs.push(new b2Vec2(159/2/drawScale,142/2/drawScale));
    //  vs.push(new b2Vec2(-159/2/drawScale,142/2/drawScale));
       
       fixDef.shape.SetAsVector(vs,vs.length);

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.Set(width/2,height/2);

        let body = world.CreateBody(bodyDef)
        body.CreateFixture(fixDef);

        this.body=body;

        body.userdata=this;
        body.update=this.update.bind(this);

        this.img=new Image();
        this.img.src="image/1001.png";
        this.ww=159;
        this.hh=142;

        body.SetPositionAndAngle(new b2Vec2(width/2,height/2),0);

      //  body.centerpoint=body.GetLocalPoint(body.GetWorldCenter());
        body.centerpoint=new b2Vec2(0,0);
        body.lastangle=0;

        console.log(body);
        
    }

    update(ctx,body)
    {

        ctx.drawImage(this.img, 0, 0, this.ww, this.hh);

        let fix = body.GetFixtureList();

        if(fix==null)
        {
            return;
        }

        let shape=body.GetFixtureList().GetShape();

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
         ctx.fill();
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


        



         

        
         ctx.restore();

         this.drawCircle(body.GetWorldPoint(body.centerpoint),"#ff0000");
         this.drawCircle(position,"#000000");

        

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

    drawCircle(origin,color)
     {

        let temp =ctx.fillStyle;

       ctx.fillStyle =color;
       // canvas.graphics.drawCircle(origin.x*worldScale,origin.y*worldScale,5);

        ctx.beginPath();
        ctx.arc(origin.x*drawScale,origin.y*drawScale,5,0,2*Math.PI);
        ctx.stroke();

        ctx.fillStyle =temp;
    };
}