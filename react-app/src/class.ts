import { timeMax } from "./const";

export class Manager {
  constructor(
    public spawnGage: number = 0,
    public spawnCount: number = 3,
    public spawnRate: number = 0.001,
    public score: number = 0,
    public sunpower: number = 0,
    public initialAnimeTime: number = 1,
    public sunpowerMult: number = 1,
    public marukogeUUIDs: string[] = []
  ) {
    // this.score = score
    // this.num = 0
  }
  gameCheck(_time: number) {
    return _time < timeMax;
  }
  initialAnimeUpdate() {
    if (this.initialAnimeTime <= 0) {
      this.initialAnimeTime = 0;
      return;
    }
    this.initialAnimeTime -= 0.01;
  }
  spawnGageUpdate() {
    this.spawnGage += this.spawnRate;
    if (this.spawnGage >= this.spawnCount) {
      this.spawnGage = 0;
      return this.spawnCount;
    }
    return 0;
  }
  addScore(_num: number) {
    this.score += _num;
  }
  sunpowerCalc(_time: number) {
    this.sunpower = Math.sin((_time / timeMax) * Math.PI);
    if (this.sunpower < 0) this.sunpower = 0;
  }
}

export class FoodInfo {
  constructor(
    public name: string,
    public isOnBonnet: boolean,
    public status: string,
    public maxGrilledness: number,
    public grilledness: number
  ) {}
  grill(_power: number) {
    if (this.isOnBonnet == true) {
      this.grilledness += _power;
    }
  }
  grillednessCheck() {
    if (this.grilledness >= this.maxGrilledness && this.status == "yake") {
      // this.status = "koge";
      return "koge";
    } else if (
      this.grilledness >= this.maxGrilledness / 2 &&
      this.status == "nama"
    ) {
      // this.status = "yake";
      return "yake";
    } else if (
      this.grilledness >= (3 * this.maxGrilledness) / 2 &&
      this.status == "koge"
    )
      return "marukoge";
  }
}
