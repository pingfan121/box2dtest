class ContactEvent
{

    constructor()
    {
        //碰撞回调
        var contactListener = new b2ContactListener();
        contactListener.BeginContact = this.beginContact.bind(this); 
        contactListener.EndContact   = this.endContact.bind(this);
        contactListener.PreSolve     = this.preSolve.bind(this);
        contactListener.PostSolve    = this.postSolve.bind(this);
        world.SetContactListener(contactListener);
    }

     //碰撞开始前事件
     preSolve(contact){

    }

    //碰撞开始事件
    beginContact(contact){
        // if(contact.GetFixtureA().GetBody().GetUserData() == "ball" || contact.GetFixtureB().GetBody().GetUserData() == "ball"){
        //       var ball = contact.GetFixtureB().GetShape();
        //       ball.SetRadius(ball.GetRadius()*1.2);
        //   }
      };

      //碰撞结束事件
      endContact(contact){

      }
      //碰撞完成事件
      postSolve(contact)
      {
        // console.log("碰撞了呀");
      }
}