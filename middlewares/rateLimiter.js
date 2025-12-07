import redis from "../services/redis.js";

export const rateLimiter = async (req, res, next) => {   
    const ip = req.ip;
    const key = `rate-limit:${ip}`;
    console.log(ip)

    try{
        const reqCount = await redis.incr(key);

        if(reqCount === 1){
            await redis.expire(key, 300);
        }

        if(reqCount > 10){
            return res.status(429).json({ message: "Too many requests. Please try again later." });
        }
        
        next();
    }
    catch(err){
        console.error("Rate Limiter Error: ", err);
        return res.status(500).json({ message: "Internal Server Error from Redis" });
    }
}