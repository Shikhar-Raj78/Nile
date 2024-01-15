import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[11rem] lg:w-[15rem] h-[17rem] md:h-[20rem] overflow-hidden flex flex-col gap-4 border border-[#444444]">
      <div className="relative h-[80%]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <HeartIcon product={product} />
      </div>
      <Link to={`/product/${product._id}`}>
        <div className="p-2 h-[20%]">
          <div className="flex items-center flex-col gap-2 mx-1 flex-nowrap overflow-hidden">
            <div className="flex w-full">
              <h4 className="text-[12px] md:text-sm md:font-bold">
                {product.name?.substring(0, 20)}...
              </h4>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SmallProduct;
