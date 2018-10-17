
let foods=new Array();



class FoodManager
{
    constructor()
    {
        this.imgs=new Map();
    }


    //添加一个食物
    addOneFood(name)
    {

        if(this.imgs.has(name)==false)
        {
            let img=new Image();
            img.src="image/food/"+name+".png";

            this.imgs.set(name,img);

            img.onload=function()
            {
                let food=new Food(this);
                foods.push(food);
            }
        }
        else
        {
            let food=new Food(this.imgs.get(name));
            foods.push(food);
        }
    }
}