import Image from "next/image";
import PropTypes from "prop-types";
import React, { useRef, useState} from "react";
//import { UncontrolledTooltip = "reactstrap";
//import cbethIcon from "/assets/Images/Icon/crypto/cbeth.svg";

const cbethIcon = "/assets/Images/Icon/crypto/cbeth.svg";
const compIcon = "/assets/Images/Icon/crypto/comp.svg";
const ethIcon = "/assets/Images/Icon/crypto/eth.svg";
const linkIcon = "/assets/Images/Icon/crypto/link.svg";
const stEthIcon = "/assets/Images/Icon/crypto/steth.svg";
const uniIcon = "/assets/Images/Icon/crypto/uni.svg";
const usdcIcon = "/assets/Images/Icon/crypto/usdc.svg";
const wbtcIcon = "/assets/Images/Icon/crypto/wbtc.svg";
const daiIcon = "/assets/Images/Icon/crypto/dai.svg";
const etherscanIcon = "/assets/Images/Icon/crypto/etherscan.svg";
const debankIcon = "/assets/Images/Icon/crypto/debank.svg";
const zapperIcon = "/assets/Images/Icon/crypto/zapper.svg";

const CryptoIcon = ({ name, size, address, ...rest }) => {
  const btnRef = useRef(null);
  const [ready, setReady] = useState(false);

  React.useEffect(() => {
    if (btnRef.current) {
      setReady(true);
    }
  }, [btnRef]);


  const mapping = {
    DAI: daiIcon,
    sDAI: daiIcon,
    COMP: compIcon,
    ETH: ethIcon,
    LINK: linkIcon,
    UNI: uniIcon,
    USDC: usdcIcon,
    WBTC: wbtcIcon,
    WETH: ethIcon,
    wstETH: stEthIcon,
    cbETH: cbethIcon,
    etherscan: etherscanIcon,
    debank: debankIcon,
    zapper: zapperIcon,
  };
  const Icon = mapping[name];
  if (!Icon) {
    return name;
  }


  return (
    <>
      <Image
        src={Icon}
        width={size}
        height={size}
        alt={name}
       />
    </>
  );
}

CryptoIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.string,
};

CryptoIcon.defaultProps = {
  size: "1rem",
};

export default CryptoIcon;
