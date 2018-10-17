class Ground
{
    constructor()
    {
       //创建四面墙
       this.createGround();
    }

    //创建一个盒子
    createGround() {
        //左边的墙
        let wall1fix = new b2FixtureDef;
        wall1fix.restitution = 0.8;
        wall1fix.shape = new b2PolygonShape;
        wall1fix.shape.SetAsBox(1, height / 2);


        let wall1 = new b2BodyDef;

        wall1.type = b2Body.b2_staticBody;
        wall1.position.x = -1;
        wall1.position.y = height / 2;
        world.CreateBody(wall1).CreateFixture(wall1fix);



       //下面的墙
        wall1fix.shape.SetAsBox(width / 2, 1);
        wall1.position.x = width / 2
        wall1.position.y = height +1;
        world.CreateBody(wall1).CreateFixture(wall1fix);

        //右边的墙
        wall1fix.shape.SetAsBox(1, height / 2);
        wall1.position.x = width +1;
        wall1.position.y = height / 2
        world.CreateBody(wall1).CreateFixture(wall1fix);

        //上面的墙
        wall1fix.shape.SetAsBox(width / 2, 1);
        wall1.position.x = width / 2
        wall1.position.y = -1;
        world.CreateBody(wall1).CreateFixture(wall1fix);

        

    }
}