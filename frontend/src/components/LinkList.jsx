import React from 'react';
import { useQuery, gql } from '@apollo/client';

import Link from './Link';

const FEED_QUERY = gql`
    {
        feed {
            count
            links {
                id
                createdAt
                url
                description
            }
        }
    }
`;

const LinkList = () => {
    const { data } = useQuery(FEED_QUERY);

    return (
        <div>
            {data && (
                <>
                    {data.feed.links.map((link) => (
                        <Link key={link.id} link={link} href={link} />
                    ))}
                </>
            )}
        </div>
    );
};

export default LinkList;
