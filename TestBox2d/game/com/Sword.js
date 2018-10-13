

let w=70/drawScale;
let h=167/drawScale;


class Sword
{
    constructor(imgpath)
    {
        var fixDef = new b2FixtureDef;
        fixDef.density = 0.0001;      //密度
        fixDef.friction = 0.5;   //摩擦
        
        
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(0.1, h/2);
        fixDef.filter.groupIndex=-1;
       

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;  //创建一个动态物体
        bodyDef.position.Set(width/2,height/2+h/2);
        bodyDef.linearDamping=10000000;
     
        let body = world.CreateBody(bodyDef)
        body.CreateFixture(fixDef);
        body.m_customGravity=new b2Vec2(0,0);

        var fixDef = new b2FixtureDef;
        fixDef.density = 100;      //密度
        fixDef.friction = 0.5;   //摩擦
        fixDef.restitution = 1; //反弹
        fixDef.shape = new b2CircleShape(0.01);
        fixDef.filter.groupIndex=-1;
       

         var bodyDef = new b2BodyDef;
         bodyDef.type = b2Body.b2_dynamicBody;  //创建一个动态物体
         bodyDef.position.Set(width / 2, height /2);
       //  bodyDef.filter.groupIndex=-1;

         let head = world.CreateBody(bodyDef)
         head.CreateFixture(fixDef);
         head.m_customGravity=new b2Vec2(0,0);



        var disjoint=new b2DistanceJointDef();
        //设置要连接的两个物体
        disjoint.bodyA=head;
        disjoint.bodyB=body;
        disjoint.localAnchorA.Set(0,0);
        disjoint.localAnchorB.Set(0,-h/2);
        //设置距离，如果不设置则为两物体之间的实际距离，如果设置的距离与实际距离不符，则拉伸至设置的距离
        disjoint.length=0.01;
        world.CreateJoint(disjoint);


        var disjoint=new b2DistanceJointDef();
        //设置要连接的两个物体
        disjoint.bodyA=head;
        disjoint.bodyB=body;
        disjoint.localAnchorA.Set(0,0);
        disjoint.localAnchorB.Set(0,0);
        //设置距离，如果不设置则为两物体之间的实际距离，如果设置的距离与实际距离不符，则拉伸至设置的距离
        disjoint.length=h/2+0.01;
        world.CreateJoint(disjoint);


         this.body=body;
         this.head=head;
         this.img=new Image();
         this.img.src="image/sword/1changhong.png";

         body.update=this.update.bind(this);
    }

    update(ctx,head)
    {
        let position =this.body.GetPosition();

        let xx = position.x;
        let yy = position.y ;

        let angle=this.body.GetAngle();

       // console.log("jiaodu:"+angle);

        let xxx =w/2;
        let yyy =h/2;

        
    
         /*封装canvas操作起始处*/
         ctx.save();
         /*原点偏移*/
         ctx.translate(xx* drawScale, yy * drawScale);
         /*旋转 (弧度)*/
         ctx.rotate(angle);
         /*原点偏移*/
         //ctx.translate(-xx* drawScale, -yy * drawScale);
         /*绘制图片*/
         ctx.drawImage(this.img, -xxx * drawScale, -yyy * drawScale);
         
         //ctx.translate(xx* drawScale, yy * drawScale);

         ctx.rotate(-angle);

         ctx.translate(-xx* drawScale, -yy * drawScale);

         /*封装canvas操作结束处*/
         ctx.restore();





        //  let position =this.body.GetPosition();

        //  let xx = position.x;
        //  let yy = position.y ;
 
        //  let angle=this.body.GetAngle();
 
        //  console.log("jiaodu:"+angle);
 
        //  let xxx =this.body.m_fixtureList.m_shape.m_vertices[0].x;
        //  let yyy =this.body.m_fixtureList.m_shape.m_vertices[0].y;
     
 
 
        //   /*封装canvas操作起始处*/
        //   ctx.save();
        //   /*原点偏移*/
        //   ctx.translate(xx* drawScale, yy * drawScale);
        //   /*旋转 (弧度)*/
        //   ctx.rotate(angle);
        //   /*原点偏移*/
        //   //ctx.translate(-xx* drawScale, -yy * drawScale);
        //   /*绘制图片*/
        //   ctx.drawImage(this.img, ( xxx) * drawScale, ( yyy) * drawScale);
          
        //   //ctx.translate(xx* drawScale, yy * drawScale);
 
        //   ctx.rotate(-angle);
 
        //   ctx.translate(-xx* drawScale, -yy * drawScale);
 
        //   /*封装canvas操作结束处*/
        //   ctx.restore();



        let speed=10;

        let vel = this.head.GetLinearVelocity();

          if(vel.x<0)
          {
              vel.x =-speed;
          }
          else
          {
            vel.x =speed;
          }

          if(vel.y<0)
          {
              vel.y =-speed;
          }
          else
          {
            vel.y =speed/2;
          }
   
    }
}