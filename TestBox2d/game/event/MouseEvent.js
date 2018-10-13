
// let mouseX,mouseY,isMouseDown,mouseJoint,mousePVec,selectedBody;

// class MouseEvent
// {
//     constructor()
//     {
//         canvas.addEventListener("mousedown", this.mouseDown.bind(this), true);
//         canvas.addEventListener("mouseup", this.mouseUp.bind(this), true);
//     }

//      mouseDown(e){
//         mouseX = e.offsetX / drawScale;
//         mouseY = e.offsetY / drawScale;
//         isMouseDown = true;
//         document.addEventListener("mousemove", this.mouseMove, true);
        
//         if(isMouseDown && (!mouseJoint)) {
//             var body = this.getBodyAtMouse();
//             if(body) {
//                var md = new b2MouseJointDef();
//                md.bodyA = world.GetGroundBody();
//                md.bodyB = body;
//                md.target.Set(mouseX, mouseY);
//                md.collideConnected = true;
//                md.maxForce = 300.0 * body.GetMass();
//                mouseJoint = world.CreateJoint(md);
//                body.SetAwake(true);
//             };
//          };
//     };
//     mouseMove(e){
//         mouseX = e.offsetX / drawScale;
//         mouseY = e.offsetY / drawScale;
         
//          if(mouseJoint) {
//              if(isMouseDown) {
//                 mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
//           }
//          }
//     };
//     mouseUp(e){
//         document.removeEventListener("mousemove", this.mouseMove, true);
//         isMouseDown = false;
//         let mouseX = 0;
//         let mouseY = 0;
//         if(mouseJoint){
//             world.DestroyJoint(mouseJoint);
//             mouseJoint = null;
//         }
//     };

//     getBodyAtMouse() {
//         mousePVec = new b2Vec2(mouseX, mouseY);
//         var aabb = new b2AABB();
//         aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
//         aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);
        
//         // Query the world for overlapping shapes.
//         selectedBody = null;
//         world.QueryAABB(this.getBodyCallBack, aabb);
//         return selectedBody;
//      };

//      getBodyCallBack(fixture) {
//         if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
//            if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) 
//            {
//               selectedBody = fixture.GetBody();
//               return false;
//            }
//         }
//         return true;
//      };
// }