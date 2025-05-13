import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Tags() {

    const [tags, setTags] = useState([]);

    const loadTags = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/tags`)
            setTags(result.data);
        } catch (error) {
            console.error('Error loading tags:', error);
        }
    };

    const groupedList = tags.reduce((acc, obj) => {
        const firstLetter = obj.name.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(obj);
        return acc;
    }, {});

    const sortedKeys = Object.keys(groupedList).sort();

      useEffect(() => {
        loadTags();
      }, []);

    return (
        <div>
            <div className='container'>
                <div className="pb-1 mb-3 mt-1 text-black border-bottom d-flex justify-content-between align-items-center">
                    <nav aria-label="breadcrumb" className='mt-3'>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Tags</li>
                        </ol>
                    </nav>
                </div>
                <h2>Tags</h2>

                <div className='py-4'>
                    <div className="column-container">
                        {sortedKeys.map((letter) => (
                            <div key={letter} className="column-group">
                                <h4>{letter}</h4>
                                <ul className="list-group">
                                    {groupedList[letter].map((tag) => (
                                        <li className="list-group-item border-0" key={tag.id}>
                                            <a href={`/tags/${tag.name}/spots`} className="text-decoration-none">
                                                <p>{tag.name} {tag.spotsCount > 0 && ` (${tag.spotsCount})`}</p>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
