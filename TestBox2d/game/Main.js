


let body = null;

let event=null;

let xmldata=null;

class Main {

    init() {


        xmldata=this.getxmlDoc("image/test.xml");
       
        this.createGround();
        this.createDebugDraw();
        setInterval(this.update, 1000 / 60);

       // let sword=new Sword();




        let food=new Food();

        event=new MouseEvent2();
       

    }

    //创建一个盒子
    createGround() {
        var wall1fix = new b2FixtureDef;
        wall1fix.density = 0.1;
        wall1fix.friction = 0.1;
        wall1fix.restitution = 0.2;
        wall1fix.shape = new b2PolygonShape;
        wall1fix.shape.SetAsBox(2, height / 2);


        let wall1 = new b2BodyDef;

        wall1.type = b2Body.b2_staticBody;
        wall1.position.x = 2
        wall1.position.y = height / 2

        world.CreateBody(wall1).CreateFixture(wall1fix);




        wall1fix.shape.SetAsBox(width / 2, 2);
        wall1.position.x = width / 2
        wall1.position.y = height - 2
        world.CreateBody(wall1).CreateFixture(wall1fix);

        wall1fix.shape.SetAsBox(2, height / 2);
        wall1.position.x = width - 2
        wall1.position.y = height / 2
        world.CreateBody(wall1).CreateFixture(wall1fix);

        wall1fix.shape.SetAsBox(width / 2, 2);
        wall1.position.x = width / 2
        wall1.position.y = 2
        world.CreateBody(wall1).CreateFixture(wall1fix);

        

    }

    createBall() {
        var fixDef = new b2FixtureDef;
        fixDef.density = .5;
        fixDef.friction = 0.4;
        fixDef.restitution = 0.8;
        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;//是静态还是动态！当然是会动的爽了！
        bodyDef.position.Set(width / 2, height / 2);
        fixDef.shape = new b2CircleShape(1);
        let ball = world.CreateBody(bodyDef)
        ball.CreateFixture(fixDef);

        return ball;
    };

    //创建测试绘画
    createDebugDraw() {
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(ctx);
        debugDraw.SetDrawScale(drawScale);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);
    }

    update()
     {


        ctx.clearRect(0,0,800,600);

        world.Step(
            1 / 60   //frame-rate
            , 10       //velocity iterations
            , 10       //position iterations
        );
        world.DrawDebugData();
        world.ClearForces();

        event.update();

        for (var  b  =  world.m_bodyList;  b  !=  null;  b  =  b.m_next) {
            if (b.update != null) {
                b.update(ctx,b);
            }
        }



        

    };

    getxmlDoc(xmlFile) {
        var xmlDoc;
        if (window.ActiveXObject) {
            xmlDoc = new ActiveXObject('Microsoft.XMLDOM');//IE
            xmlDoc.async = false;
            xmlDoc.load(xmlFile);
        }
        else if (navigator.userAgent.indexOf("Firefox") > 0) { //火狐

            xmlDoc = document.implementation.createDocument('', '', null);
            xmlDoc.load(xmlFile);
        }
        else { //谷歌
            var xmlhttp = new window.XMLHttpRequest();
            xmlhttp.open("GET", xmlFile, false);
            xmlhttp.send(null);
            if (xmlhttp.readyState == 4) {
                xmlDoc = xmlhttp.responseXML.documentElement;
            }
        }

        return this.parse2(xmlDoc)
    }


    parse(xmlDoc)
    {

        let data=new Map();


        var temp = xmlDoc.getElementsByTagName("body");

         for (let i = 0; i < temp.length; i++) 
         {
            var temp2 = temp[i].getElementsByTagName("fixture");
            var temp3 = temp2[0].getElementsByTagName("polygon");

            var arr2=new Array();

            for (let i = 0; i < temp3.length; i++) 
            {
                var temp4 = temp3[i].getElementsByTagName("vertex");

                var arr = new Array();

                for (let i = 0; i < temp4.length; i++)
                {

                    let point=new b2Vec2(temp4[i].attributes[0].value/drawScale, temp4[i].attributes[1].value/drawScale);
                   
                    if(this.haveItem(arr2,point)==false)
                    {
                        arr2.push(point);
                    }
                   
                }

               
            }

            this.arrangeClockwise(arr2);

            data.set(temp[i].attributes["name"].value,arr2);
        }

        return data;
    }

    parse2(xmlDoc)
    {

        let data=new Map();

        var temp = xmlDoc.getElementsByTagName("body");

         for (let i = 0; i < temp.length; i++) 
         {
            var temp2 = temp[i].getElementsByTagName("fixture");
            var temp3 = temp2[0].getElementsByTagName("polygon");

            var arr2=new Array();

            for (let i = 0; i < temp3.length; i++) 
            {
                var temp4 = temp3[i].getElementsByTagName("vertex");

                var arr = new Array();

                for (let i = 0; i < temp4.length; i++)
                {

                    let point=new b2Vec2(temp4[i].attributes[0].value/drawScale, temp4[i].attributes[1].value/drawScale);
                   
                    if(this.haveItem(arr2,point)==false)
                    {
                        arr.push(point);
                    }
                   
                }

                arr2.push(arr);

               
            }

           // this.arrangeClockwise(arr2);

            data.set(temp[i].attributes["name"].value,arr2);
        }

        return data;
    }


    getVertices(name)
     {

        if(xmldata.has(name))
        {
            return xmldata.get(name);
        }

        return null;


    }

    


    // getxmlDoc(xmlFile) {
    //     var xmlDoc;
    //     if (window.ActiveXObject) {
    //         xmlDoc = new ActiveXObject('Microsoft.XMLDOM');//IE
    //         xmlDoc.async = false;
    //         xmlDoc.load(xmlFile);
    //     }
    //     else if (navigator.userAgent.indexOf("Firefox") > 0) { //火狐

    //         xmlDoc = document.implementation.createDocument('', '', null);
    //         xmlDoc.load(xmlFile);
    //     }
    //     else { //谷歌
    //         var xmlhttp = new window.XMLHttpRequest();
    //         xmlhttp.open("GET", xmlFile, false);
    //         xmlhttp.send(null);
    //         if (xmlhttp.readyState == 4) {
    //             xmlDoc = xmlhttp.responseXML.documentElement;
    //         }
    //     }

    //     return xmlDoc;
    // }

    // getVertices(name) {
    //     var temp = xmldata.getElementsByTagName("body");

    //     if (temp != null && temp.length > 0) {
    //         var temp2 = temp[0].getElementsByTagName("vertex");
    //         if (temp2 != null && temp2.length > 0) {
    //             var arr = new Array();

    //             for (let i = 0; i < temp2.length; i++) {
    //                 let a = new b2Vec2(temp2[i].attributes[0].value/drawScale, temp2[i].attributes[1].value/drawScale);

    //                 if (this.haveItem(arr, a) == false) {
    //                     arr.push(a);
    //                 }

    //             }

    //             return this.arrangeClockwise(arr);
    //         }
    //     }

    //     return null;


    // }

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


}