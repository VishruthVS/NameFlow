// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ENSMetadata {
    struct Domain {
        string domainName;
        string subdomainName;
    }

    mapping(address => Domain) private domains;

    event DomainMetadataSet(
        address indexed owner,
        string domainName,
        string subdomainName
    );

    function setDomainMetadata(
        address owner,
        string memory domainName,
        string memory subdomainName
    ) public {
        domains[owner] = Domain(domainName, subdomainName);
        emit DomainMetadataSet(owner, domainName, subdomainName);
    }

    function getDomainMetadata(
        address owner
    )
        public
        view
        returns (string memory domainName, string memory subdomainName)
    {
        Domain memory d = domains[owner];
        return (d.domainName, d.subdomainName);
    }
}
