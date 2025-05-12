import React from 'react'

export default function Rating() {
    return (
        <div>
            <div className='container'>
                <nav aria-label="breadcrumb" className='mt-3'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/user/profile" className="text-decoration-none">Profile</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Rating calculation</li>
                    </ol>
                </nav>
                <div className="col-md-5 text-start mb-3">
                    <h5 className="h5 pb-1 mb-3 text-black border-bottom border-black text-start">Rating calculation</h5>
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th scope="col">Rarity</th>
                                <th scope="col">Production count</th>
                                <th scope="col">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row"><span class="badge bg-danger text-white">Unique</span></th>
                                <td>1</td>
                                <td>1000</td>
                            </tr>
                            <tr>
                                <th scope="row"><span class="badge bg-warning text-dark">Ultra Exclusive</span></th>
                                <td>2 - 10</td>
                                <td>750</td>
                            </tr>
                            <tr>
                                <th scope="row"><span class="badge bg-primary text-white">Super Exclusive</span></th>
                                <td>11 - 50</td>
                                <td>500</td>
                            </tr>
                            <tr>
                                <th scope="row"><span class="badge bg-success text-white">Exclusive</span></th>
                                <td>51 - 200</td>
                                <td>300</td>
                            </tr>
                            <tr>
                                <th scope="row"><span class="badge bg-info text-dark">Ultra Rare</span></th>
                                <td>201 - 500</td>
                                <td>200</td>
                            </tr>
                            <tr>
                                <th scope="row"><span class="badge bg-secondary text-white">Super Rare</span></th>
                                <td>501 - 1000</td>
                                <td>100</td>
                            </tr>
                            <tr>
                                <th scope="row"><span class="badge bg-dark text-white">Rare</span></th>
                                <td>1001 - 5000</td>
                                <td>50</td>
                            </tr>
                            <tr>
                                <th scope="row"><span class="badge bg-light text-dark border">Semi-Mass Produced</span></th>
                                <td>5001 - 20000</td>
                                <td>25</td>
                            </tr>
                            <tr>
                                <th scope="row"><span class="badge bg-light text-dark border">Mass Produced</span></th>
                                <td>20001 - 100000</td>
                                <td>10</td>
                            </tr>
                            <tr>
                                <th scope="row"><span class="badge bg-light text-dark border">Common</span></th>
                                <td>Default</td>
                                <td>5</td>
                            </tr>
                        </tbody>
                    </table>

                    <p>Comment - 1 pts</p>
                </div>
            </div>
        </div>
    )
}
