import { PrismaClient } from "@prisma/client";

/**
 * Class singleton untuk sambungan database dengan prisma client
 */

class PrismaSingleton {
  constructor() {
    if (!PrismaSingleton.instance) {
      this.prisma = new PrismaClient();
      console.log("prisma baru");
      PrismaSingleton.instance = this;
    }

    return PrismaSingleton.instance;
  }

  getInstance() {
    return this.prisma;
  }
}

const prisma = new PrismaSingleton();
export default prisma.getInstance();
