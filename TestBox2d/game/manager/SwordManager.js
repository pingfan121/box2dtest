
let swords=new Array();



class SwordManager
{
    constructor()
    {
         this.imgs=new Map();
    }


    //添加一把剑
    addOneSword(name)
    {
        if(this.imgs.has(name)==false)
        {
            let img=new Image();
            img.src="image/sword/"+name+".png";

            this.imgs.set(name,img);

            img.onload=function()
            {
                let sword=new Sword(this);
                swords.push(sword);
            }
        }
        else
        {
            let sword=new Sword(this.imgs.get(name));

            swords.push(sword);
        }
    }
}