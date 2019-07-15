
//初期データセット クラスタごとに配列として与える
let clusters = [
    [
        {x:38,y:24,z:50},
        {x:70,y:50,z:69},
        {x:40,y:84,z:21},
    ],[
        {x:57,y:13,z:30},
        {x:20,y:65,z:14},
        {x:95,y:81,z:86},
    ],[
        {x:66,y:75,z:72},
        {x:35,y:49,z:44},
    ],[
        {x:88,y:91,z:95},
        {x:72,y:71,z:60},
    ],
];

//重心計算 
const calcCenter = (clt)=>{
    let ret={x:0,y:0,z:0};
    clt.forEach(data=>{
        ret.x+=data.x;
        ret.y+=data.y;
        ret.z+=data.z;
    });
    ret.x /=  clt.length;
    ret.y /=  clt.length;
    ret.z /=  clt.length;

    return ret;
};

//重心計算 戻り値はクラスタごとの重心の配列
const calcCenters = (clts)=>{
    const ret=new Array();

    clts.forEach(clt => {
        ret.push( calcCenter(clt) );
    });

    return ret;
}

//データ2点間の距離
const distance = (a,b)=>{
    return  (a.x - b.x)*(a.x - b.x)+
            (a.y - b.y)*(a.y - b.y)+
            (a.z - b.z)*(a.z - b.z);
};

//最も近い重心のクラスタへラベルを書き換え 戻り値は新しいクラスタs
const rewriteClusterLabel =(clts)=>{
    const centers =calcCenters(clts);
    let clts_new =new Array(clts.length);

    clts.flat().forEach(data=>{
        let minDist =-1;
        let minLabel=0;
        centers.forEach((center,label)=>{   //最も近い重心を求める
            const dist = distance(data,center);
            if( dist<minDist || minDist==-1 ){
                minDist = dist;
                minLabel=label;
            }
        });
        if(clts_new[minLabel]==undefined)
            clts_new[minLabel] =new Array();

        clts_new[minLabel].push(data); //求めたクラスタにpush
    });

    //あとでJson.stringify(clusters)で比較できるように、配列をソートしておく
    clts_new.forEach(clt=>{
        clt.sort((a,b)=>{
            if(a.x>b.x) return 1;
            if(a.x<b.x) return -1;
            
            if(a.y>b.y) return 1;
            if(a.y<b.y) return -1;
            
            if(a.z>b.z) return 1;
            if(a.z>b.z) return -1;
        });
    });
    clts_new.sort((a,b)=>{
        if(calcCenter(a).x > calcCenter(b).x ) return 1;
        if(calcCenter(a).x < calcCenter(b).x ) return -1;
        
        if(calcCenter(a).y > calcCenter(b).y ) return 1;
        if(calcCenter(a).y < calcCenter(b).y ) return -1;
        
        if(calcCenter(a).z > calcCenter(b).z ) return 1;
        if(calcCenter(a).z < calcCenter(b).z ) return -1;
    });
    
    return clts_new;
};

//あるクラスタの、中心とデータの距離の2乗の総和が戻り値
const sumDistance =(clt)=>{
    const center=calcCenter(clt);
    let ret =0;
    clt.forEach((data)=>{
        ret += distance(data,center);
    });
    return ret;
};

//クラスタ間距離が戻り値
const clusterDistance =(clt1,clt2)=>{
    const centers = calcCenters([clt1,clt2]);
    let ret =0;
    return sumDistance([clt1,clt2].flat()) - sumDistance(clt1) - sumDistance(clt2);
};

const joinCluster = (clts)=>{
    let minDistance =-1;
    let minDistanceClusters={
        clt1:-1,
        clt2:-1
    };
    const retClts =new Array();
    if(clts.length<=1)
        return clts;
    for(let i=0;i<clts.length-1;i++){
        for(let j=i+1;j<clts.length;j++){
            const distance = clusterDistance(clts[i],clts[j]);
            if(minDistance==-1 || distance<minDistance)
                minDistance = distance;
                minDistanceClusters.clt1=i;
                minDistanceClusters.clt2=j;
        }
    };
    clts.forEach((clt,i)=>{
        if(i==minDistanceClusters.clt2)
            clt.forEach(data=>{
                retClts[minDistanceClusters.clt1].push(data);
            });
        else
            retClts.push(clt);
    });

    return {
        clt1:minDistanceClusters.clt1,
        clt2:minDistanceClusters.clt2,
        clts:retClts
    };
};

const main =()=>{
    console.log("初期データセット");    
    console.log(clusters);
    console.log("\r\n");

    let clts_old = clusters;
    let clts;

    while(1){
        clts = rewriteClusterLabel(clts_old); 
        
        if(JSON.stringify(clts_old)===JSON.stringify(clts)){
            break; //クラスタの割当に変化がなければ終了
        }
        clts_old = clts;
        console.log("クラスタの重心計算を行い、最も近い重心のクラスタにラベルを書き換えた結果");
        console.log(clts);
        console.log("\r\n");

    }
    console.log("書き換えが終了\r\n\r\nK-means法適用後");
    console.log(clts);
    console.log("\r\n");

    while(clts.length>1){
        console.log("クラスタが複数あるのでウォード法による階層的クラスタリングを行う");
        console.log("上述のクラスタを上から順に0,1,2, ... と呼ぶ");
        const reted = joinCluster(clts);
        console.log(`この中で最もクラスタ間距離が近いのは ${reted.clt1} と${reted.clt2}`);
        console.log("これを結合すると次のようになる。");
        clts = reted.clts;
        console.log(clts);
    }
    console.log("以上");

};

main();
