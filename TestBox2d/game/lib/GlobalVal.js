
//方便使用
var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2AABB = Box2D.Collision.b2AABB,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2ContactListener = Box2D.Dynamics.b2ContactListener,
    b2DistanceJointDef =Box2D.Dynamics.Joints.b2DistanceJointDef,
    b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
    b2Segment = Box2D.Collision.b2Segment;


var drawScale = 30;  //1米等于三十个像素

var width = 800 / drawScale;
var height = 600 / drawScale;

var gravity = new b2Vec2(0, 9.8);
var world = new b2World(gravity, true);