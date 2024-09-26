export const niku: number = 750;
export const tamanegi: number = 500;
export const medamayaki: number = 250;

export const foodScore: number[] = [60,40,20,-60];

export const timeMax: number = 50;
export const carSizes: number[][] = [[26,12,-1.5,1],[38,14,0,1.5],[60,36,5,1.5]];

export class ModelURLS {
    static hera = "https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/hera.fbx"
    static manaita = "https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/manaita.fbx"
    static stage01 = "https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/stage01.fbx"

    static car(carId: string) {
        return "https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/" + carId + ".fbx"
    }

    static niku = "https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/niku.fbx"
    static tamanegi = "https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/tamanegi.fbx"
    static medamayaki = "https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/medamayaki.fbx"

    static yake(foodName : string) {
        return "https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/" + foodName + "_yake.fbx"
    }
    static koge(foodName : string) {
        return "https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/" + foodName + "_koge.fbx"
    }
    static marukoge = "https://bonnet-grills-bbq-app-bucket.s3.us-west-2.amazonaws.com/models/fbx/marukoge.fbx"
}