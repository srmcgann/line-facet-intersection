    lineFaceI = (X1, Y1, Z1, X2, Y2, Z2, facet, autoFlipNormals=false, showNormals=false) => {
      let I_=(A,B,M,D,E,F,G,H)=>(K=((G-E)*(B-F)-(H-F)*(A-E))/(J=(H-F)*(M-A)-(G-E)*(D-B)))>=0&&K<=1&&(L=((M-A)*(B-F)-(D-B)*(A-E))/J)>=0&&L<=1?[A+K*(M-A),B+K*(D-B)]:0
      let R_ = (Rl,Pt,Yw)=>{
        let M=Math, A=M.atan2, H=M.hypot
        X=S(p=A(X,Y)+Rl)*(d=H(X,Y)),Y=C(p)*d,X=S(p=A(X,Z)+Yw)*(d=H(X,Z)),Z=C(p)*d,Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z)),Z=C(p)*d
      }
      let rotSwitch = m =>{
        switch(m){
          case 0: R_(0,0,Math.PI/2); break
          case 1: R_(0,Math.PI/2,0); break
          case 2: R_(Math.PI/2,0,Math.PI/2); break
        }        
      }
      let ax = 0, ay = 0, az = 0
      facet.map(q_=>{ ax += q_[0], ay += q_[1], az += q_[2] })
      ax /= facet.length, ay /= facet.length, az /= facet.length
      let b1 = facet[2][0]-facet[1][0], b2 = facet[2][1]-facet[1][1], b3 = facet[2][2]-facet[1][2]
      let c1 = facet[1][0]-facet[0][0], c2 = facet[1][1]-facet[0][1], c3 = facet[1][2]-facet[0][2]
      let crs = [b2*c3-b3*c2,b3*c1-b1*c3,b1*c2-b2*c1]
      let d = Math.hypot(...crs)+.001
      let nls = 1 //normal line length
      crs = crs.map(q=>q/d*nls)
      let X1_ = ax, Y1_ = ay, Z1_ = az
      let flip = 1
      if(autoFlipNormals){
        let d1_ = Math.hypot(X1_-X1,Y1_-Y1,Z1_-Z1)
        let d2_ = Math.hypot(X1-(ax + crs[0]/99),Y1-(ay + crs[1]/99),Z1-(az + crs[2]/99))
        flip = d2_>d1_?-1:1
      }
      let X2_ = ax + (crs[0]*=flip), Y2_ = ay + (crs[1]*=flip), Z2_ = az + (crs[2]*=flip)

      if(showNormals){
        x.beginPath()
        X = X1_, Y = Y1_, Z = Z1_
        R(Rl,Pt,Yw,1)
        if(Z>0) x.lineTo(...Q())
        X = X2_, Y = Y2_, Z = Z2_
        R(Rl,Pt,Yw,1)
        if(Z>0) x.lineTo(...Q())
        stroke('#f00','',.5,true)
      }
      
      let p1_ = Math.atan2(X2_-X1_,Z2_-Z1_)
      let p2_ = -(Math.acos((Y2_-Y1_)/(Math.hypot(X2_-X1_,Y2_-Y1_,Z2_-Z1_)+.001))+Math.PI/2)
      let isc = false, iscs = [false,false,false]
      X = X1, Y = Y1, Z = Z1
      R_(0,-p2_,-p1_)
      let rx_ = X, ry_ = Y, rz_ = Z
      for(let m=3;m--;){
        if(isc === false){
          X = rx_, Y = ry_, Z = rz_
          rotSwitch(m)
          X1_ = X, Y1_ = Y, Z1_ = Z = 5, X = X2, Y = Y2, Z = Z2
          R_(0,-p2_,-p1_)
          rotSwitch(m)
          X2_ = X, Y2_ = Y, Z2_ = Z
          facet.map((q_,j_)=>{
            if(isc === false){
              let l = j_
              X = facet[l][0], Y = facet[l][1], Z = facet[l][2]
              R_(0,-p2_,-p1_)
              rotSwitch(m)
              let X3_=X, Y3_=Y, Z3_=Z
              l = (j_+1)%facet.length
              X = facet[l][0], Y = facet[l][1], Z = facet[l][2]
              R_(0,-p2_,-p1_)
              rotSwitch(m)
              let X4_ = X, Y4_ = Y, Z4_ = Z
              if(l_=I_(X1_,Y1_,X2_,Y2_,X3_,Y3_,X4_,Y4_)) iscs[m] = l_
            }
          })
        }
      }
      if(iscs.filter(v=>v!==false).length==3){
        let iscx = iscs[1][0], iscy = iscs[0][1], iscz = iscs[0][0]
        let pointInPoly = true
        ax=0, ay=0, az=0
        facet.map((q_, j_)=>{ ax+=q_[0], ay+=q_[1], az+=q_[2] })
        ax/=facet.length, ay/=facet.length, az/=facet.length
        X = ax, Y = ay, Z = az
        R_(0,-p2_,-p1_)
        X1_ = X, Y1_ = Y, Z1_ = Z
        X2_ = iscx, Y2_ = iscy, Z2_ = iscz
        facet.map((q_,j_)=>{
          if(pointInPoly){
            let l = j_
            X = facet[l][0], Y = facet[l][1], Z = facet[l][2]
            R_(0,-p2_,-p1_)
            let X3_ = X, Y3_ = Y, Z3_ = Z
            l = (j_+1)%facet.length
            X = facet[l][0], Y = facet[l][1], Z = facet[l][2]
            R_(0,-p2_,-p1_)
            let X4_ = X, Y4_ = Y, Z4_ = Z
            if(I_(X1_,Y1_,X2_,Y2_,X3_,Y3_,X4_,Y4_)) pointInPoly = false
          }
        })
        if(pointInPoly){
          X = iscx, Y = iscy, Z = iscz
          R_(0,p2_,0)
          R_(0,0,p1_)
          isc = [[X,Y,Z], [crs[0],crs[1],crs[2]]]
        }
      }
      return isc
    }    
