// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract HorrorShow is ERC721, ERC721URIStorage{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    address public admin;

    // base uri
    string public baseIPFS;

    // whitelist 1
    address[] public whitelist1;
    uint256 public whitelist1MaxMint;

    // white list 2
    address[] public whitelist2;
    uint256 public whitelist2MaxMint;


    modifier onlyAdmin {
        require(msg.sender == admin, "Not admin of contract");
        _;
    }

    constructor()ERC721("HorrorShow", "HRS"){
        admin = payable(msg.sender);
    }

    function addToWhitelist1(address newWhitelist) public onlyAdmin{
        whitelist1.push(newWhitelist);
    }
    function addToWhitelist2(address newWhitelist) public onlyAdmin{
        whitelist2.push(newWhitelist);
    }

    // minting function

    function safeMint(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseIPFS;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }



}