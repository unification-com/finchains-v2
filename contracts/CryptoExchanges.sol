// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

contract CryptoExchanges {
    address public owner;
    uint public baseThreshold;
    uint public timeDiff;

    modifier onlyOwner() {
        require(msg.sender == owner,
            "Only owner can call this function.");
        _;
    }

    modifier isAuthorized() {
        require(whiteList[msg.sender] == true,
            "Only authorized addresses can call this function.");
        _;
    }

    // struct to store Crypto data
    struct Currency {
        uint256 price;
        string priceRaw;
        uint timestamp;
        bool isSet;
    }

    // struct to store discrepancy threshold for a pair
    struct Threshold {
        uint value;
        bool isSet;
    }

    //event to emit Crypto data
    event CurrencyUpdate(
        address indexed from,
        string pair,
        bytes32 indexed pairHash,
        uint256 price,
        string priceRaw,
        uint timestamp,
        string exchange
    );

    //event shows which Crypto has a possible arbitrage opportunity at a specified price
    event Discrepancy(
        string pair,
        bytes32 indexed pairHash,
        address oracle1,
        uint256 price1,
        uint timestamp1,
        string exchange1,
        address oracle2,
        uint256 price2,
        uint timestamp2,
        string exchange2,
        uint threshold
    );

    event AddDataSource(
        address oracle,
        string exchange
    );

    event ThresholdUpdated(
        string pair,
        bytes32 indexed pairHash,
        uint oldThreshold,
        uint newThreshold
    );

    event TimeDiffUpdated(
        uint oldDiff,
        uint newDiff
    );

    uint public numSources;
    mapping(address => bool) public whiteList; //whitelisted oracle addresses
    address[] public oracleArr; //array of oracle addresses
    mapping(address => string) public exchanges; // the exchange an oracle is watching
    /*
    Mapping of pairs to a mapping of oracles and data exchanges
    Tickers can be for example "ETH/USD", "ETH/BTC" etc.
    */
    mapping(bytes32 => mapping(address => Currency)) currencies;

    mapping(bytes32 => Threshold) pairThresholds;

    constructor (uint _baseThreshold, uint _timeDiff) public {
        owner = msg.sender;
        whiteList[owner] = true;
        baseThreshold = _baseThreshold;
        timeDiff = _timeDiff;
    }

    function updateCurrency(
        string memory _pair,
        uint256 _price,
        string memory _priceRaw,
        uint256 _timestamp
    )
    public isAuthorized() {

        bytes32 pairHash = keccak256(abi.encodePacked(_pair));
        bool setUpdate = false;
        if (!currencies[pairHash][msg.sender].isSet) {
            setUpdate = true;
        } else {
            if (currencies[pairHash][msg.sender].timestamp != _timestamp) {
                setUpdate = true;
            }
        }

        if (setUpdate) {
            currencies[pairHash][msg.sender] = Currency({price : _price, priceRaw : _priceRaw, timestamp : _timestamp, isSet : true});

            if (!pairThresholds[pairHash].isSet) {
                pairThresholds[pairHash].value = baseThreshold;
                pairThresholds[pairHash].isSet = true;
            }

            emit CurrencyUpdate(
                msg.sender,
                _pair,
                pairHash,
                _price,
                _priceRaw,
                _timestamp,
                exchanges[msg.sender]
            );

            compareCurrencies(_pair, pairHash, msg.sender);
        }
    }

    function compareCurrencies(string memory _pair, bytes32 pairHash, address _o1) private isAuthorized() {
        for (uint i = 0; i < numSources; i++) {
            if (errorMargins(pairHash, _o1, oracleArr[i])) {
                emit Discrepancy(
                    _pair,
                    pairHash,
                    _o1,
                    currencies[pairHash][_o1].price,
                    currencies[pairHash][_o1].timestamp,
                    exchanges[_o1],
                    oracleArr[i],
                    currencies[pairHash][oracleArr[i]].price,
                    currencies[pairHash][oracleArr[i]].timestamp,
                    exchanges[oracleArr[i]],
                    pairThresholds[pairHash].value
                );
            }
        }
    }

    function errorMargins(bytes32 _pairHash, address _o1, address _o2) public view returns (bool) {
        /*
        This function checks for a significant price difference
        for each stock between exchanges. The threshold level to emit an event is
        configured in the configureErrorMargins function
        */

        uint256 p1 = currencies[_pairHash][_o1].price;
        uint ts1 = currencies[_pairHash][_o1].timestamp;
        uint256 p2 = currencies[_pairHash][_o2].price;
        uint ts2 = currencies[_pairHash][_o2].timestamp;
        uint tsDiff = max(ts1, ts2) - min(ts1, ts2);
        if (tsDiff > timeDiff) {
            return false;
        }
        if (_o1 == _o2) {
            return false;
        }
        if (p1 == 0 || p2 == 0) {
            return false;
        }

        uint threshold = pairThresholds[_pairHash].value;
        uint priceDiff = max(p1, p2) - min(p1, p2);
        if (priceDiff >= threshold) return true;

        return false;

    }

    function addExchange(address _oracle, string memory _exchange) public onlyOwner() {
        if (whiteList[_oracle] != true) {
            whiteList[_oracle] = true;
            oracleArr.push(_oracle);
            exchanges[_oracle] = _exchange;
            numSources = numSources + 1;
            emit AddDataSource(_oracle, _exchange);
        }
    }

    function setThreshold(string memory _pair, uint _threshold) public onlyOwner() {
        require(_threshold > 0, "threshold must be > 0");
        bytes32 pairHash = keccak256(abi.encodePacked(_pair));

        uint oldThreshold = baseThreshold;
        if (!pairThresholds[pairHash].isSet) {
            oldThreshold = pairThresholds[pairHash].value;
        }

        pairThresholds[pairHash].value = _threshold;
        pairThresholds[pairHash].isSet = true;

        ThresholdUpdated(_pair, pairHash, oldThreshold, _threshold);
    }

    function setTimeDiff(uint _timeDiff) public onlyOwner() {
        require(_timeDiff > 0, "timeDiff must be > 0");
        uint oldDiff = timeDiff;
        timeDiff = _timeDiff;
        TimeDiffUpdated(oldDiff, _timeDiff);
    }

    //function to determine the smallest between two values. Used as a way to
    //find the percent difference between two prices, and to avoid negative values

    function min(uint a, uint b) private pure returns (uint) {
        return a < b ? a : b;
    }

    function max(uint a, uint b) private pure returns (uint) {
        return a > b ? a : b;
    }

    function getExchange(address _oracle) public view returns (string memory) {
        return exchanges[_oracle];
    }

    function getAllOracles() public view returns (address[] memory){
        address[] memory ret = new address[](numSources);
        for (uint i = 0; i < numSources; i++) {
            ret[i] = oracleArr[i];
        }
        return ret;
    }

    function getThreshold(string memory _pair) public view returns (uint) {
        bytes32 pairHash = keccak256(abi.encodePacked(_pair));
        return pairThresholds[pairHash].value;
    }

    function getLastPriceByAddress(string memory _pair, address _oracle) public view returns (uint256) {
        bytes32 pairHash = keccak256(abi.encodePacked(_pair));
        if (currencies[pairHash][_oracle].isSet) {
            return currencies[pairHash][_oracle].price;
        }
        return 0;
    }
}
