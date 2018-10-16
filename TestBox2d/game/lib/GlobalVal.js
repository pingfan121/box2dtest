
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

var arrangeClockwise =function(vec) 
{
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

var haveItem=function(arr, point) {
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
var haveItem2=function(arrarr, point) 
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

var findCentroid=function(vs, count) 
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


var comp1 =function(a, b) {
    //这个是 arrangeClockwise()方法里用到的一个比较函数——它可以很快的判断两个 point 的
    // x 坐标的大小
    if (a.x > b.x) {
        return 1;
    } else if (a.x < b.x) {
        return -1;
    }
    return 0;
}
var det=function(x1, y1, x2, y2, x3, y3)
 {
    // 这个方法用来返回 3x3 矩阵的行列式值
    // 如果你学过矩阵，你肯定知道如果三个给定的点顺时针排列则返回正值，如果逆时针排
    //列则返回负值，如果三点在一条线，则返回 0
    // 另外一个有用的知识点，行列式值的绝对值是这个三个点组成的三角形面积的两倍
    return x1*y2+x2*y3+x3*y1-y1*x2-y2*x3-y3*x1;
}
