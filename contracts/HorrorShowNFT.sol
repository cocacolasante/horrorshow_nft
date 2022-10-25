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

    Counters.Counter public _tokenIdCounter;

    address public admin;

    // contract pause boolean
    bool public contractPaused = false;

    // base uri
    string public baseIPFS;

    // whitelist 1
    address[] public whitelist;
    uint256 public whitelistMaxMint;
    mapping(address=>bool) public canWhitelistMint;

    // modifiers
    modifier onlyAdmin {
        require(msg.sender == admin, "Not admin of contract");
        _;
    }

    modifier isPaused(){
        require(contractPaused == false, "Contract is currently paused");
        _;
    }

    modifier onlyWhitelist(){
        require(canWhitelistMint[msg.sender] == true, "Not on whitelist" );
        _;
    }


    constructor()ERC721("HorrorShow", "HRS"){
        admin = payable(msg.sender);
    }

    // white list functions

    function addToWhitelist(address newWhitelist) public onlyAdmin{
        whitelist.push(newWhitelist);
        canWhitelistMint[newWhitelist] = true;
    }

    function removeFromWhitelist(address removedAddress) public onlyAdmin{
        canWhitelistMint[removedAddress] = false;
    }

    // set whitelist max mint amount
    function setWhitelistMintLimit(uint newLimit) public onlyAdmin{
        whitelistMaxMint = newLimit;
    }

    // pause contract function 
    function pauseContract() public onlyAdmin {
        require(contractPaused == false, "contract is currently live");
        contractPaused = true;
    }

    function unpauseContract() public onlyAdmin{
        require(contractPaused == true, "contract is currently paused");
        contractPaused = false;
    }




    // whitelist minting function

   function whitelistMint(address to, string memory uri) public onlyWhitelist {
        require(_tokenIdCounter.current() < whitelistMaxMint, "max whitelist minted already");
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }




    // minting function

    function safeMint(address to, string memory uri) public isPaused {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }



    

    function _baseURI() internal view override returns (string memory) {
        return baseIPFS;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) isPaused {
        super._burn(tokenId);
    }




    // get tokenURI
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }



}